'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserSchema } from '@/lib/validations';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { updateUser } from '@/lib/actions/user.action';

interface Props {
	clerkId: string;
	user: string;
}

const Profile = ({ clerkId, user }: Props) => {
	const parsedUser = JSON.parse(user);
	const router = useRouter();
	const pathName = usePathname();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const profileForm = useForm<z.infer<typeof UserSchema>>({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			name: parsedUser.name || '',
			username: parsedUser.username || '',
			location: parsedUser.location || '',
			bio: parsedUser.bio || '',
			website: parsedUser.website || ''
		}
	});

	const onSubmit = async (values: z.infer<typeof UserSchema>) => {
		setIsSubmitting(true);
		try {
			console.log(values);
			await updateUser({ clerkId, updateData: values, path: pathName });
			router.back();
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<Form {...profileForm}>
				<form onSubmit={profileForm.handleSubmit(onSubmit)} className='flex w-full flex-col gap-10'>
					<FormField
						control={profileForm.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex w-full flex-col'>
								<FormLabel className='paragraph-semibold text-dark400_light800'>
									Name <span className='text-primary-500'>*</span>
								</FormLabel>
								<FormControl className='mt-3'>
									<Input
										{...field}
										className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									/>
								</FormControl>
								<FormMessage className='text-red-500' />
							</FormItem>
						)}
					/>

					<FormField
						control={profileForm.control}
						name='username'
						render={({ field }) => (
							<FormItem className='flex w-full flex-col'>
								<FormLabel className='paragraph-semibold text-dark400_light800'>
									Username <span className='text-primary-500'>*</span>
								</FormLabel>
								<FormControl className='mt-3'>
									<Input
										{...field}
										className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									/>
								</FormControl>
								<FormMessage className='text-red-500' />
							</FormItem>
						)}
					/>

					<FormField
						control={profileForm.control}
						name='location'
						render={({ field }) => (
							<FormItem className='flex w-full flex-col'>
								<FormLabel className='paragraph-semibold text-dark400_light800'>Location</FormLabel>
								<FormControl className='mt-3'>
									<Input
										{...field}
										placeholder='Where do you live?'
										className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									/>
								</FormControl>
								<FormMessage className='text-red-500' />
							</FormItem>
						)}
					/>
					<FormField
						control={profileForm.control}
						name='website'
						render={({ field }) => (
							<FormItem className='flex w-full flex-col'>
								<FormLabel className='paragraph-semibold text-dark400_light800'>Portfolio Link</FormLabel>
								<FormControl className='mt-3'>
									<Input
										{...field}
										type='url'
										placeholder='Your Portfolio URL'
										className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									/>
								</FormControl>
								<FormMessage className='text-red-500' />
							</FormItem>
						)}
					/>

					<FormField
						control={profileForm.control}
						name='bio'
						render={({ field }) => (
							<FormItem className='flex w-full flex-col'>
								<FormLabel className='paragraph-semibold text-dark400_light800'>Bio</FormLabel>
								<FormControl className='mt-3'>
									<Textarea
										{...field}
										rows={5}
										placeholder="What's spacial about you?"
										className='no-focus paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
									/>
								</FormControl>
								<FormMessage className='text-red-500' />
							</FormItem>
						)}
					/>

					<div className='mt-7 flex justify-end'>
						<Button type='submit' className='primary-gradient w-fit !text-light-900' disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : 'Submit'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Profile;
