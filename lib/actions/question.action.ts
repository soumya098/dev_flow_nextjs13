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
	QuestionVoteParams,
	RecommendedParams
} from './shared';
import { revalidatePath } from 'next/cache';

export async function getQuestions(params: GetQuestionsParams) {
	try {
		connectToDB();

		const { searchQuery, filter, page = 1, pageSize = 10 } = params;
		const skipAmount = (page - 1) * pageSize;
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

		const questions = await Question.find(query)
			.populate({ path: 'tags', model: Tag })
			.populate({ path: 'author', model: User })
			.skip(skipAmount)
			.limit(pageSize)
			.sort(sortOptions);

		const questionSize = await Question.countDocuments(query);
		const isNext = questionSize > skipAmount + questions.length;

		return { questions, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getRecommendedQuestions(params: RecommendedParams) {
	try {
		connectToDB();

		const { userId, page = 1, pageSize = 20, searchQuery } = params;
		const skipAmount = (page - 1) * pageSize;

		const user = await User.findOne({ clerkId: userId });

		if (!user) {
			throw new Error('user not found');
		}

		// Find the user's interactions
		const userInteractions = await Interaction.find({ user: user._id }).populate('tags');

		// Extract tags from user's interactions
		const userTags = userInteractions.reduce((tags, interaction) => {
			if (interaction.tags) {
				if (interaction.tags.length > 0) tags = tags.concat(interaction.tags);
			}
			return tags;
		}, []);

		// Get distinct tag IDs from user's interactions
		const distinctUserTagIds = [
			// @ts-ignore
			...new Set(userTags.map((tag: any) => tag._id))
		];

		const query: FilterQuery<IQuestion> = {
			$and: [
				{ tags: { $in: distinctUserTagIds } }, // Questions with user's tags
				{ author: { $ne: user._id } } // Exclude user's own questions
			]
		};

		if (searchQuery) {
			query.$or = [{ title: { $regex: searchQuery, $options: 'i' } }, { content: { $regex: searchQuery, $options: 'i' } }];
		}

		const totalQuestions = await Question.countDocuments(query);

		const recommendedQuestions = await Question.find(query)
			.populate({ path: 'tags', model: Tag })
			.populate({ path: 'author', model: User })
			.skip(skipAmount)
			.limit(pageSize);

		const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

		return { questions: recommendedQuestions, isNext };
	} catch (error) {
		console.error('Error getting recommended questions:', error);
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
		const tagDocuments = [];

		const question = await Question.create({ title, content, author });

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

		// create Interaction and increment author's reputation by +5 for asking question
		await Interaction.create({ user: author, action: 'ask_question', question: question._id, tags: tagDocuments });
		await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

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

		// increment user's reputation by +1/-1 for upVoting/revoking an upvote to a question
		await User.findByIdAndUpdate(userId, { $inc: { reputation: hasUpVoted ? -1 : 1 } });

		// increment authors reputation by +10/-10 for receiving upVote/revoke an upvote on their question
		await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasUpVoted ? -10 : 10 } });

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

		// increment user's reputation by -1/+1 for downVoting/revoking a downvote to a question
		await User.findByIdAndUpdate(userId, { $inc: { reputation: hasDownVoted ? 1 : -1 } });

		// increment authors reputation by -2/+2 for receiving downVote/revoke a downvote on their question
		await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasDownVoted ? 2 : -2 } });

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
