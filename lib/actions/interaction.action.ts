'use server';
import Question from '@/database/question.model';
import { connectToDB } from '../mongoose';
import { ViewQuestionParams } from './shared';
import Interaction from '@/database/interaction.model';

export async function viewQuestion(params: ViewQuestionParams) {
	try {
		await connectToDB();
		const { questionId, userId } = params;

		// update view count of the question
		await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

		if (userId) {
			const existingInteraction = await Interaction.findOne({ user: userId, action: 'view', question: questionId });

			if (existingInteraction) {
				return console.log('User has already viewed this question');
			}

			await Interaction.create({ user: userId, question: questionId, action: 'view' });
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}
