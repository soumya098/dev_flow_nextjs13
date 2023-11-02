import Answer from '@/components/forms/Answer';
import Metric from '@/components/shared/Metric';
import ParseHtml from '@/components/shared/ParseHtml';
import RenderTag from '@/components/shared/RenderTag';
import { getQuestionById } from '@/lib/actions/question.action';
import { formatNumber, getTimestamps } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const QuestionPage = async ({ params }: any) => {
	const questionId = params?.id;

	const result = await getQuestionById({ questionId });

	return (
		<>
			<div className='flex-start w-full flex-col'>
				<div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
					<Link href={`profile/${result.author.clerkId}`} className='flex-start gap-1'>
						<Image src={result.author.picture} alt='user' width={22} height={22} className='rounded-full object-contain' />
						<p className='paragraph-semibold text-dark300_light700'>{result.author.name}</p>
					</Link>

					<div className='flex justify-end'>voting</div>
				</div>

				<h2 className='h2-semibold text-dark200_light900 mt-3 w-full text-left'>{result.title}</h2>
			</div>

			<div className='flex-start mb-8 mt-5 w-full gap-4'>
				<Metric
					imgUrl='/assets/icons/clock.svg'
					alt='clock'
					value='asked'
					title={`${getTimestamps(result.createdAt)}`}
					textStyles='body-medium text-dark400_light700'
				/>
				<Metric
					imgUrl='/assets/icons/message.svg'
					alt='answers'
					value={formatNumber(result.answers.length)}
					title=' Answers'
					textStyles='small-medium text-dark400_light800'
				/>
				<Metric
					imgUrl='/assets/icons/eye.svg'
					alt='views'
					value={formatNumber(result.views)}
					title=' Views'
					textStyles='small-medium text-dark400_light800'
				/>
			</div>

			<ParseHtml data={result.content} />

			<div className='flex-start mt-8 flex-wrap gap-2'>
				{result.tags.map((tag: any) => (
					<RenderTag key={tag._id} id={tag._id} name={tag.name} />
				))}
			</div>

			<Answer />
		</>
	);
};

export default QuestionPage;
