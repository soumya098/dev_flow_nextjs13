import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTag from './RenderTag';

const RightSideBar = () => {
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

const questions = [
	'Creola Katherine Johnson: mathematician',
	'Mario José Molina-Pasquel Henríquez: chemist',
	'Mohammad Abdus Salam: physicist',
	'Percy Lavon Julian: chemist',
	'Subrahmanyan Chandrasekhar: astrophysicist'
];

const renderQuestions = questions.map((question) => (
	<Link href='/' className='flex-between cursor-pointer gap-6' key={question}>
		<p className='body-medium text-dark500_light700'>{question}</p>
		<Image src='/assets/icons/chevron-right.svg' width={15} height={15} alt='go-to' className='invert-colors' />
	</Link>
));

const tags = [
	{ count: 3, label: 'next' },
	{ count: 4, label: 'react' },
	{ count: 5, label: 'veu' },
	{ count: 7, label: 'javascript' }
];

const renderTags = tags.map((tag) => <RenderTag key={tag.count} name={tag.label} id={tag.label} count={tag.count} showCount />);

export default RightSideBar;
