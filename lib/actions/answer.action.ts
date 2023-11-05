'use server';
import { connectToDB } from '../mongoose';
import Answer from '@/database/answer.model';
import Question from '@/database/question.model';
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from './shared';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';

export const createAnswer = async (params: CreateAnswerParams) => {
	try {
		await connectToDB();
		const { content, userId, questionId, path } = params;

		const newAnswer = await Answer.create({ content, author: userId, question: questionId });

		await Question.findByIdAndUpdate(questionId, {
			$push: { answers: newAnswer._id }
		});

		// TODO: Add interaction

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getAnswers = async (params: GetAnswersParams) => {
	try {
		await connectToDB();
		const { questionId } = params;

		const answers = await Answer.find({ question: questionId })
			.populate({ path: 'author', model: User, select: '_id clerkId name picture' })
			.sort({ createdAt: -1 });

		return { answers };
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export async function upVoteAnswer(params: AnswerVoteParams) {
	try {
		await connectToDB();
		const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;
		let updateQuery = {};

		if (hasUpVoted) {
			updateQuery = { $pull: { upVotes: userId } };
		} else if (hasDownVoted) {
			updateQuery = {
				$pull: { downVotes: userId },
				$push: { upVotes: userId }
			};
		} else {
			updateQuery = { $addToSet: { upVotes: userId } };
		}

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

		if (!answer) {
			throw new Error('Answer not found!');
		}

		// increment authors reputation

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function downVoteAnswer(params: AnswerVoteParams) {
	try {
		await connectToDB();
		const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;
		let updateQuery = {};

		if (hasDownVoted) {
			updateQuery = { $pull: { downVotes: userId } };
		} else if (hasUpVoted) {
			updateQuery = {
				$pull: { upVotes: userId },
				$push: { downVotes: userId }
			};
		} else {
			updateQuery = { $addToSet: { downVotes: userId } };
		}

		const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

		if (!answer) {
			throw new Error('Answer not found!');
		}

		// increment authors reputation

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
