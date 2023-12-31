'use server';
import { FilterQuery } from 'mongoose';
import { connectToDB } from '../mongoose';
import User, { IUser } from '@/database/user.model';
import Question, { IQuestion } from '@/database/question.model';
import Answer from '@/database/answer.model';
import Tag from '@/database/tag.model';
import {
	CreateUserParams,
	DeleteUserParams,
	GetAllUsersParams,
	GetSavedQuestionsParams,
	GetUserByIdParams,
	GetUserStatsParams,
	ToggleSaveQuestionParams,
	UpdateUserParams
} from './shared';
import { revalidatePath } from 'next/cache';
import { BadgeCriteriaType } from '@/types';
import { assignBadges } from '../utils';

export async function getAllUsers(params: GetAllUsersParams) {
	try {
		connectToDB();
		const { page = 1, filter, pageSize = 1, searchQuery } = params;
		const skipAmount = (page - 1) * pageSize;
		const query: FilterQuery<IUser> = {};
		let sortOptions = {};

		if (searchQuery) {
			const escapedQuery = searchQuery.replace(/^@/, '');
			const regexPattern = new RegExp(escapedQuery, 'i');

			query.$or = [{ name: { $regex: regexPattern } }, { username: { $regex: regexPattern } }];
		}

		switch (filter) {
			case 'new_users':
				sortOptions = { joinedAt: -1 };
				break;
			case 'old_users':
				sortOptions = { joinedAt: 1 };
				break;
			case 'top_contributors':
				sortOptions = { reputation: -1 };
				break;
			default:
				sortOptions = { createdAt: -1 };
				break;
		}

		const users = await User.find(query).skip(skipAmount).limit(pageSize).sort(sortOptions);
		const userSize = await User.countDocuments(query);
		const isNext = userSize > skipAmount + users.length;

		return { users, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserById(params: GetUserByIdParams) {
	try {
		connectToDB();
		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });
		return user;
	} catch (error) {
		console.log(error);
	}
}

export async function createUser(params: CreateUserParams) {
	try {
		connectToDB();

		const newUser = await User.create(params);

		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updateUser(params: UpdateUserParams) {
	try {
		connectToDB();
		const { clerkId, updateData, path } = params;

		await User.findOneAndUpdate({ clerkId }, updateData, {
			new: true
		});

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function deleteUser(params: DeleteUserParams) {
	try {
		connectToDB();
		const { clerkId } = params;

		const user = await User.findOne({ clerkId });

		if (!user) {
			throw new Error('User Not Found');
		}

		// delete user from database
		// and delete questions, answers, comments, etc related to that user

		// get user question ids
		// eslint-disable-next-line no-unused-vars
		// const questionIds = await Question.find({ author: user._id }).distinct('_id');
		// delete user questions
		await Question.deleteMany({ author: user._id });

		// delete user
		const deletedUser = await User.findByIdAndDelete(user._id);
		return deletedUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
	try {
		connectToDB();
		const { userId, questionId, path } = params;

		const user = await User.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const isQuestionSaved = user.saved.includes(questionId);

		if (isQuestionSaved) {
			await User.findByIdAndUpdate(userId, { $pull: { saved: questionId } }, { new: true });
		} else {
			await User.findByIdAndUpdate(userId, { $addToSet: { saved: questionId } }, { new: true });
		}

		revalidatePath(path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAllSavedQuestions(params: GetSavedQuestionsParams) {
	try {
		connectToDB();
		const { clerkId, page = 1, filter, pageSize = 20, searchQuery } = params;
		const query: FilterQuery<IQuestion> = {};
		const skipAmount = (page - 1) * pageSize;
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
			case 'most_recent':
				sortOptions = { createdAt: -1 };
				break;
			case 'oldest':
				sortOptions = { createdAt: 1 };
				break;
			case 'most_voted':
				sortOptions = { upVotes: -1 };
				break;
			case 'most_viewed':
				sortOptions = { views: -1 };
				break;
			case 'most_answered':
				sortOptions = { answers: -1 };
				break;
			default:
				sortOptions = { createdAt: -1 };
				break;
		}

		const user = await User.findOne({ clerkId }).populate({
			path: 'saved',
			match: query,
			options: { sort: sortOptions },
			populate: [
				{ path: 'tags', model: Tag, select: '_id name' },
				{ path: 'author', model: User, select: '_id clerkId name picture' }
			]
		});

		if (!user) {
			throw new Error('user not found');
		}

		const { saved } = user;
		const totalSavedQuestions = saved.length;
		const paginatedSaved = saved.slice(skipAmount).slice(0, pageSize);
		const isNext = totalSavedQuestions > paginatedSaved.length + skipAmount;

		return { questions: paginatedSaved, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getUserInfo(params: GetUserByIdParams) {
	try {
		connectToDB();
		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			throw new Error(`User not found`);
		}

		const totalQuestions = await Question.countDocuments({ author: user._id });
		const totalAnswers = await Answer.countDocuments({ author: user._id });

		const [questionUpVotes] = await Question.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upVoteSize: { $size: '$upVotes' } } },
			{ $group: { _id: null, totalUpVotes: { $sum: '$upVoteSize' } } }
		]);

		const [answerUpVotes] = await Answer.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upVoteSize: { $size: '$upVotes' } } },
			{ $group: { _id: null, totalUpVotes: { $sum: '$upVoteSize' } } }
		]);

		const [questionViews] = await Question.aggregate([{ $match: { author: user._id } }, { $group: { _id: null, totalViews: { $sum: '$views' } } }]);

		const criteria = [
			{ type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
			{ type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
			{ type: 'QUESTION_UPVOTES' as BadgeCriteriaType, count: questionUpVotes?.totalUpVotes || 0 },
			{ type: 'ANSWER_UPVOTES' as BadgeCriteriaType, count: answerUpVotes?.totalUpVotes || 0 },
			{ type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews?.totalViews || 0 }
		];

		const badgeCounts = assignBadges({ criteria });

		return { user, totalQuestions, totalAnswers, badgeCounts };
	} catch (error) {
		console.log(error);
	}
}

export async function getUserQuestions(params: GetUserStatsParams) {
	try {
		connectToDB();
		const { userId, page = 1, pageSize = 10 } = params;
		const skipAmount = (page - 1) * pageSize;

		const totalQuestions = await Question.countDocuments({ author: userId });
		const userQuestions = await Question.find({ author: userId })
			.skip(skipAmount)
			.limit(pageSize)
			.sort({ createdAt: -1, views: -1, upVotes: -1 })
			.populate('tags', '_id name')
			.populate('author', '_id clerkId name picture');

		const isNext = totalQuestions > userQuestions.length + skipAmount;

		return { totalQuestions, questions: userQuestions, isNext };
	} catch (error) {
		console.log(error);
	}
}

export async function getUserAnswers(params: GetUserStatsParams) {
	try {
		connectToDB();
		const { userId, page = 1, pageSize = 10 } = params;
		const skipAmount = (page - 1) * pageSize;

		const totalAnswers = await Answer.countDocuments({ author: userId });
		const userAnswers = await Answer.find({ author: userId })
			.skip(skipAmount)
			.limit(pageSize)
			.sort({ createdAt: -1, upVotes: -1 })
			.populate('question', '_id title')
			.populate('author', '_id clerkId name picture');

		const isNext = totalAnswers > userAnswers.length + skipAmount;

		return { totalAnswers, answers: userAnswers, isNext };
	} catch (error) {
		console.log(error);
	}
}
