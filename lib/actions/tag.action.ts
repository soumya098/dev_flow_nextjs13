'use server';

import User from '@/database/user.model';
import { connectToDB } from '../mongoose';
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from './shared';
import Tag, { ITag } from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Question from '@/database/question.model';

export async function getAllTags(params: GetAllTagsParams) {
	try {
		await connectToDB();
		const { page, filter, searchQuery, pageSize } = params;
		const query: FilterQuery<ITag> = searchQuery ? { name: { $regex: new RegExp(searchQuery, 'i') } } : {};
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

		const tags = await Tag.find(query).sort(sortOptions);

		return { tags };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		await connectToDB();

		const { tagId, page, pageSize = 10, searchQuery } = params;
		const tagFilter: FilterQuery<ITag> = { _id: tagId };

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

		const questions = tag.questions;
		return { questions, tagTitle: tag.name };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		await connectToDB();
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
