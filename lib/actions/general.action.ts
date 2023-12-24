'use server';

import Question from '@/database/question.model';
import { connectToDB } from '../mongoose';
import { SearchParams } from './shared';
import User from '@/database/user.model';
import Tag from '@/database/tag.model';
import Answer from '@/database/answer.model';

const SearchableTypes = ['question', 'answer', 'user', 'tag'];
const ModelsAndTypes = [
	{ model: Question, searchField: 'title', type: 'question' },
	{ model: User, searchField: 'name', type: 'user' },
	{ model: Tag, searchField: 'name', type: 'tag' },
	{ model: Answer, searchField: 'content', type: 'answer' }
];

export async function globalSearch(params: SearchParams) {
	try {
		connectToDB();
		let results: any = [];
		const { query, type } = params;
		const typeLower = type?.toLowerCase();
		const regexQuery = { $regex: query, $options: 'i' };

		if (!typeLower || !SearchableTypes.includes(typeLower)) {
			// search across all type
			for (const { model, searchField, type } of ModelsAndTypes) {
				const queryResults = await model.find({ [searchField]: regexQuery }).limit(2);

				results.push(
					...queryResults.map((item) => ({
						title: type === 'answer' ? `Answers containing ${query}` : item[searchField],
						id: type === 'user' ? item.clerkId : type === 'answer' ? item.question : item._id,
						type
					}))
				);
			}
		} else {
			// search across specified model
			const searchableModelInfo = ModelsAndTypes.find((item) => item.type === typeLower);
			if (!searchableModelInfo) {
				throw new Error('invalid search type');
			}

			const queryResult = await searchableModelInfo.model.find({ [searchableModelInfo.searchField]: regexQuery }).limit(8);

			results = queryResult.map((item) => ({
				title: typeLower === 'answer' ? `Answers containing ${query}` : item[searchableModelInfo.searchField],
				id: typeLower === 'user' ? item.clerkId : typeLower === 'answer' ? item.question : item._id,
				type: searchableModelInfo.type
			}));
		}

		return JSON.stringify(results);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
