'use server';
import { connectToDB } from '../mongoose';
import Answer from '@/database/answer.model';
import Question from '@/database/question.model';
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from './shared';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';
import Interaction from '@/database/interaction.model';

export const createAnswer = async (params: CreateAnswerParams) => {
	try {
		await connectToDB();
		const { content, userId, questionId, path } = params;
		const newAnswer = await Answer.create({ content, author: userId, question: questionId });

		const question = await Question.findByIdAndUpdate(questionId, {
			$push: { answers: newAnswer._id }
		});

		// create Interaction and increment author's reputation by +10 for answering
		await Interaction.create({ user: userId, action: 'submit_answer', question: questionId, answer: newAnswer._id, tags: question.tags });
		await User.findByIdAndUpdate(userId, { $inc: { reputation: 10 } });

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getAnswers = async (params: GetAnswersParams) => {
	try {
		connectToDB();
		const { questionId, filter, page = 1, pageSize = 1 } = params;
		const skipAmount = (page - 1) * pageSize;
		let sortOptions = {};

		switch (filter) {
			case 'highest_upvotes':
				sortOptions = { upVotes: -1 };
				break;
			case 'lowest_upvotes':
				sortOptions = { upVotes: 1 };
				break;
			case 'recent':
				sortOptions = { createdAt: -1 };
				break;
			case 'old':
				sortOptions = { createdAt: 1 };
				break;
			default:
				sortOptions = { createdAt: -1 };
				break;
		}

		const totalAnswers = await Answer.countDocuments({ question: questionId });
		const answers = await Answer.find({ question: questionId })
			.populate({ path: 'author', model: User, select: '_id clerkId name picture' })
			.skip(skipAmount)
			.limit(pageSize)
			.sort(sortOptions);

		const isNext = totalAnswers > skipAmount + answers.length;

		return { answers, isNext };
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

		// increment user's reputation by +2/-2 for upVoting/revoking an upvote to a answer
		await User.findByIdAndUpdate(userId, { $inc: { reputation: hasUpVoted ? -2 : 2 } });

		// increment user's reputation by +10/-10 for receiving upVote/revoke an upvote on their answer
		await User.findByIdAndUpdate(answer.author, { $inc: { reputation: hasUpVoted ? -10 : 10 } });

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

		// increment user's reputation by -2/+2 for downVoting/revoking a downvote to an answer
		await User.findByIdAndUpdate(userId, { $inc: { reputation: hasDownVoted ? 2 : -2 } });

		// increment authors reputation by -2/+2 for receiving downVote/revoke a downvote on their answer
		await User.findByIdAndUpdate(answer.author, { $inc: { reputation: hasDownVoted ? 10 : -10 } });

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function deleteAnswer(params: DeleteAnswerParams) {
	try {
		connectToDB();
		const { answerId, path } = params;

		const answer = await Answer.findById(answerId);

		if (!answer) {
			throw new Error('Answer not found!');
		}

		await answer.deleteOne({ _id: answerId });
		await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } });
		await Interaction.deleteMany({ answer: answerId });

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
