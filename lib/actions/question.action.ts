'use server';

import { connectToDB } from '../mongoose';

export async function createQuestion(params) {
	try {
		// connect to db
		connectToDB();
	} catch (error) {}
}
