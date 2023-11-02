'use server';

import User from '@/database/user.model';
import { connectToDB } from '../mongoose';
import { GetTopInteractedTagsParams } from './shared';

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
