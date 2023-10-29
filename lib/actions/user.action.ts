'use server';

import User from '@/database/user.model';
import { connectToDB } from '../mongoose';
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from './shared';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function getUserById(params: GetUserByIdParams) {
	try {
		await connectToDB();
		const { userId } = params;

		const user = await User.findOne({ clerkId: userId });
		return user;
	} catch (error) {
		console.log(error);
	}
}

export async function createUser(params: CreateUserParams) {
	try {
		await connectToDB();

		const newUser = await User.create(params);

		return newUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function updateUser(params: UpdateUserParams) {
	try {
		await connectToDB();
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
		await connectToDB();
		const { clerkId } = params;

		const user = await User.findOne({ clerkId });

		if (!user) {
			throw new Error('User Not Found');
		}

		// delete user from database
		// and delete questions, answers, comments, etc related to that user

		// get user question ids
		// eslint-disable-next-line no-unused-vars
		const questionIds = await Question.find({ author: user._id }).distinct('_id');
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
