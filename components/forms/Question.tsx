'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QuestionSchema } from '@/lib/validations';
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion, updateQuestion } from '@/lib/actions/question.action';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeProvider';

interface Props {
	currUserId: string;
	type?: string;
	questionDetails?: string | undefined;
}

const Question = ({ currUserId, type, questionDetails }: Props) => {
	const { mode } = useTheme();
	const router = useRouter();
	const pathName = usePathname();
	const editorRef = useRef(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const parsedQuestionDetails = JSON.parse(questionDetails || '');

	const groupedTags = parsedQuestionDetails.tags.map((tag: any) => tag.name);

	// 1. Define your form.
	const form = useForm<z.infer<typeof QuestionSchema>>({
		resolver: zodResolver(QuestionSchema),
		defaultValues: {
			title: parsedQuestionDetails.title || '',
			explanation: parsedQuestionDetails.content || '',
			tags: groupedTags || []
		}
	});

	// 2. Define a submit handler.
	const onSubmit = async (values: z.infer<typeof QuestionSchema>) => {
		setIsSubmitting(true);
		try {
			if (type === 'create') {
				await createQuestion({ title: values.title, content: values.explanation, tags: values.tags, author: JSON.parse(currUserId), path: pathName });
				router.push('/');
			} else if (type === 'edit') {
				await updateQuestion({
					questionId: parsedQuestionDetails._id,
					title: values.title,
					content: values.explanation,
					tags: values.tags,
					path: pathName
				});
				router.push(`/question/${parsedQuestionDetails._id}`);
			}
		} catch (error) {
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
		if (e.key === 'Enter' && field.name === 'tags') {
			e.preventDefault();

			const tagInput = e.target as HTMLInputElement;
			const tagValue = tagInput.value.trim();

			if (tagValue !== '') {
				if (tagValue.length > 15) {
					return form.setError('tags', {
						type: 'required',
						message: 'Tag must be less than 15 characters'
					});
				}

				if (!field.value.includes(tagValue as never)) {
					form.setValue('tags', [...field.value, tagValue]);
					tagInput.value = '';
					form.clearErrors('tags');
				}
			} else {
				form.trigger();
			}
		}
	};

	const handleTagRemove = (tag: string, field: any) => {
		const newTags = field.value.filter((t: string) => t !== tag);
		form.setValue('tags', newTags);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-10'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Question Title <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3'>
								<Input
									{...field}
									className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
								/>
							</FormControl>
							<FormDescription className='body-regular mt-2 text-light-500'>
								Be specific and imagine you&#39;re asking a question to another person.
							</FormDescription>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='explanation'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Detailed explanation of your problem? <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3'>
								<Editor
									apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
									onInit={(evt, editor) => {
										// @ts-ignore
										editorRef.current = editor;
									}}
									initialValue={parsedQuestionDetails.content}
									onBlur={field.onBlur}
									onEditorChange={(content) => field.onChange(content)}
									init={{
										height: 350,
										menubar: false,
										plugins: [
											'advlist',
											'autolink',
											'lists',
											'link',
											'image',
											'charmap',
											'preview',
											'anchor',
											'searchreplace',
											'visualblocks',
											'codesample',
											'fullscreen',
											'insertdatetime',
											'media',
											'table'
										],
										toolbar:
											'undo redo | blocks | ' +
											'codesample | bold italic forecolor | alignleft aligncenter ' +
											'alignright alignjustify | bullist numlist',
										content_style: 'body { font-family:Inter; font-size:16px }',
										skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
										content_css: mode === 'dark' ? 'dark' : 'light'
									}}
								/>
							</FormControl>
							<FormDescription className='body-regular mt-2 text-light-500'>
								Introduce the problem and expand on what you put in the title. Minimum 20 characters.
							</FormDescription>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='tags'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col'>
							<FormLabel className='paragraph-semibold text-dark400_light800'>
								Tags <span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl className='mt-3'>
								<>
									<Input
										className='no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border'
										placeholder='Add Tags...'
										onKeyDown={(e) => handleInputKeyDown(e, field)}
									/>

									{field.value.length > 0 && (
										<div className='flex-start mt-2 gap-2'>
											{field.value.map((tag: any) => (
												<Badge
													key={tag}
													className='subtle-medium background-light800_dark300 text-light400_light500 flex-center gap-2 rounded-md border-none px-4 py-2 capitalize'
													onClick={() => handleTagRemove(tag, field)}>
													{tag}
													<Image
														src='/assets/icons/close.svg'
														alt='Close'
														width={12}
														height={12}
														className='cursor-pointer object-contain invert-0 dark:invert'
													/>
												</Badge>
											))}
										</div>
									)}
								</>
							</FormControl>
							<FormDescription className='body-regular mt-2 text-light-500'>
								Add up to 3 tags to describe what your question is about. You need to press enter to add a tag.
							</FormDescription>
							<FormMessage className='text-red-500' />
						</FormItem>
					)}
				/>

				<div className='mt-16 flex justify-end'>
					<Button type='submit' className='primary-gradient w-fit !text-light-900' disabled={isSubmitting}>
						{isSubmitting ? <>{type === 'edit' ? 'Editing...' : 'Posting...'}</> : <>{type === 'edit' ? 'Edit Question' : 'Ask Question'}</>}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default Question;
