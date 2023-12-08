import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTag from './RenderTag';
import { getHotQuestions } from '@/lib/actions/question.action';
import { getTopPopularTags } from '@/lib/actions/tag.action';

const RightSideBar = async () => {
	const hotQuestions = await getHotQuestions();
	const popularTags = await getTopPopularTags();

	const renderQuestions = hotQuestions.map((question) => (
		<Link href={`/question/${question._id}`} className='flex-between cursor-pointer gap-6' key={question._id}>
			<p className='body-medium text-dark500_light700'>{question.title}</p>
			<Image src='/assets/icons/chevron-right.svg' width={15} height={15} alt='go-to' className='invert-colors' />
		</Link>
	));

	const renderTags = popularTags.map((tag) => <RenderTag key={tag._id} name={tag.name} id={tag._id} count={tag.questionSize} showCount />);

	return (
		<section className='background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
			<div>
				<h3 className='h3-bold text-dark300_light900'>Top Questions</h3>
				<div className='mt-6 flex w-full flex-col gap-6'>{renderQuestions}</div>
			</div>

			<div className='mt-16'>
				<h3 className='h3-bold text-dark300_light900'>Popular Tags</h3>
				<div className='mt-6 flex flex-col gap-4'>{renderTags}</div>
			</div>
		</section>
	);
};

export default RightSideBar;
