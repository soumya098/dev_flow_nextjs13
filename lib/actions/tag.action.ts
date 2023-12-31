'use server';

import User from '@/database/user.model';
import { connectToDB } from '../mongoose';
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from './shared';
import Tag, { ITag } from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Question from '@/database/question.model';

export async function getAllTags(params: GetAllTagsParams) {
	try {
		connectToDB();
		const { page = 1, filter, searchQuery, pageSize = 20 } = params;
		const query: FilterQuery<ITag> = searchQuery ? { name: { $regex: new RegExp(searchQuery, 'i') } } : {};
		const skipAmount = (page - 1) * pageSize;
		let sortOptions = {};

		switch (filter) {
			case 'popular':
				sortOptions = { questions: -1 };
				break;
			case 'recent':
				sortOptions = { createdAt: -1 };
				break;
			case 'name':
				sortOptions = { name: 1 };
				break;
			case 'old':
				sortOptions = { createdAt: 1 };
				break;
			default:
				sortOptions = { createdAt: -1 };
				break;
		}

		const tags = await Tag.find(query).skip(skipAmount).limit(pageSize).sort(sortOptions);
		const tagsCount = await Tag.countDocuments(query);
		const isNext = tagsCount > tags.length + skipAmount;

		return { tags, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		connectToDB();

		const { tagId, page = 1, pageSize = 1, searchQuery } = params;
		const tagFilter: FilterQuery<ITag> = { _id: tagId };
		const skipAmount = (page - 1) * pageSize;

		const tag = await Tag.findOne(tagFilter).populate({
			path: 'questions',
			model: Question,
			match: searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {},
			options: { sort: { createdAt: -1 } },
			populate: [
				{ path: 'tags', model: Tag, select: '_id name' },
				{ path: 'author', model: User, select: '_id clerkId name picture' }
			]
		});

		if (!tag) {
			throw new Error('Tag not found');
		}

		const { questions } = tag;
		const totalQuestions = questions.length;
		const paginatedQuestions = questions.slice(skipAmount).slice(0, pageSize);
		const isNext = totalQuestions > paginatedQuestions.length + skipAmount;

		return { questions: paginatedQuestions, tagTitle: tag.name, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		connectToDB();
		const { userId } = params;

		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');

		// Find interactions for users and group by tags
		// Todo: Interactions

		return [
			{
				_id: '454',
				name: 'Tag'
			},
			{
				_id: '2345634',
				name: 'Tag2'
			}
		];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getTopPopularTags() {
	try {
		connectToDB();
		const tags = Tag.aggregate([{ $project: { name: 1, questionSize: { $size: '$questions' } } }, { $sort: { questionSize: -1 } }, { $limit: 5 }]);

		return tags;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
