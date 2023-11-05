'use server';

import { connectToDB } from '../mongoose';
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from './shared';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';

export async function getQuestions(params: GetQuestionsParams) {
	try {
		await connectToDB();
		const questions = await Question.find({})
			.populate({ path: 'tags', model: Tag })
			.populate({ path: 'author', model: User })
			.sort({ createdAt: -1 });
		return { questions };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
	try {
		await connectToDB();

		const { questionId } = params;

		const question = await Question.findById(questionId)
			.populate({ path: 'tags', model: Tag, select: '_id name' })
			.populate({ path: 'author', model: User, select: '_id clerkId name picture' });

		return question;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function createQuestion(params: CreateQuestionParams) {
	try {
		connectToDB();

		const { title, content, tags, author, path } = params;
		const question = await Question.create({ title, content, author });

		const tagDocuments = [];

		for (const tag of tags) {
			// create a new tag or fetch if already exists
			const existingTag = await Tag.findOneAndUpdate(
				{ name: { $regex: new RegExp(`^${tag}$`, 'i') } },
				{
					$setOnInsert: { name: tag },
					$push: { questions: question._id }
				},
				{ upsert: true, new: true }
			);

			tagDocuments.push(existingTag._id);
		}

		await Question.findByIdAndUpdate(question._id, {
			$push: { tags: { $each: tagDocuments } }
		});

		// TODO: increment author's reputation by +5 for asking question

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function upVoteQuestion(params: QuestionVoteParams) {
	try {
		await connectToDB();
		const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;
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

		const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

		if (!question) {
			throw new Error('Question not found!');
		}

		// increment authors reputation

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function downVoteQuestion(params: QuestionVoteParams) {
	try {
		await connectToDB();
		const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;
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

		const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

		if (!question) {
			throw new Error('Question not found!');
		}

		// increment authors reputation

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
