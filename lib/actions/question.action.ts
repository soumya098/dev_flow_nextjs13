'use server';

import { connectToDB } from '../mongoose';
import { CreateQuestionParams, GetQuestionsParams } from './shared';
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
	} catch (error) {}
}
