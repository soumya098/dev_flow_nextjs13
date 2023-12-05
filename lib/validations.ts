import * as z from 'zod';

export const QuestionSchema = z.object({
	title: z.string().min(5, 'Title must be at least 5 characters').max(130, 'Title exceeds the maximum length of 130 characters.'),
	explanation: z.string().min(20, 'Description must be at least 20 characters'),
	tags: z.array(z.string().min(1).max(15)).min(1).max(3)
});

export const AnswerSchema = z.object({
	answer: z.string().min(100, 'Answer must be at least 100 characters')
});

export const UserSchema = z.object({
	name: z.string().min(10).max(30),
	username: z.string().min(5).max(15),
	website: z.string().url({ message: 'Please provide valid URL' }).optional().or(z.literal('')),
	bio: z.string(),
	location: z.string()
});
