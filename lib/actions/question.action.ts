'use server';
import { connectToDB } from '../mongoose';
import { FilterQuery } from 'mongoose';
import Question, { IQuestion } from '@/database/question.model';
import Answer from '@/database/answer.model';
import Tag from '@/database/tag.model';
import User from '@/database/user.model';
import Interaction from '@/database/interaction.model';
import {
	CreateQuestionParams,
	DeleteQuestionParams,
	EditQuestionParams,
	GetQuestionByIdParams,
	GetQuestionsParams,
	QuestionVoteParams
} from './shared';
import { revalidatePath } from 'next/cache';

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDB();

		const { searchQuery, filter } = params;
		const query: FilterQuery<IQuestion> = {};
		let sortOptions = {};

		if (searchQuery) {
			const regexPattern = new RegExp(searchQuery, 'i');
			query.$or = [
				{ title: { $regex: regexPattern } },
				{ content: { $regex: regexPattern } },
				{
					tags: {
						$in: await Tag.find({ name: { $regex: regexPattern } }, '_id').then((matchingTags) => matchingTags.map((tag) => tag._id))
					}
				}
			];
		}

		switch (filter) {
			case 'newest':
				sortOptions = { createdAt: -1 };
				break;
			case 'recommended':
				sortOptions = {}; // TODO: special case for recommendation
				break;
			case 'frequent':
				sortOptions = { views: -1 };
				break;
			case 'unanswered':
				query.answers = { $size: 0 };
				break;
			default:
				sortOptions = { createdAt: -1 };
				break;
		}

		const questions = await Question.find(query).populate({ path: 'tags', model: Tag }).populate({ path: 'author', model: User }).sort(sortOptions);

		return { questions };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getHotQuestions() {
	try {
		connectToDB();
		const questions = await Question.find({}).sort({ views: -1, upVotes: -1 }).limit(5);

		return questions;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
	try {
		connectToDB();

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

export async function updateQuestion(params: EditQuestionParams) {
	try {
		connectToDB();

		const { questionId, title, content, path } = params;
		const question = await Question.findById(questionId).populate('tags');

		if (!question) {
			throw new Error('Could not find Question');
		}

		question.title = title;
		question.content = content;
		await question.save();

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function upVoteQuestion(params: QuestionVoteParams) {
	try {
		connectToDB();
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
		connectToDB();
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

export async function deleteQuestion(params: DeleteQuestionParams) {
	try {
		connectToDB();
		const { questionId, path } = params;

		const question = await Question.findById(questionId);

		if (!question) {
			throw new Error('Question not found!');
		}

		await question.deleteOne();
		await Answer.deleteMany({ question: questionId });
		await Interaction.deleteMany({ question: questionId });
		await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } });

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
