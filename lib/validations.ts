import * as z from 'zod';

export const QuestionSchema = z.object({
	title: z.string().min(5, 'Title must be at least 5 characters').max(130, 'Title exceeds the maximum length of 130 characters.'),
	explanation: z.string().min(20, 'Description must be at least 20 characters'),
	tags: z.array(z.string().min(1).max(15)).min(1).max(3)
});
