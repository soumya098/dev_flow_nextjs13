import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Metric';
import ParseHtml from '@/components/shared/ParseHtml';
import RenderTag from '@/components/shared/RenderTag';
import Vote from '@/components/shared/Vote';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { formatNumber, getTimestamps } from '@/lib/utils';
import { URLProps } from '@/types';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const QuestionPage = async ({ params, searchParams }: URLProps) => {
	const questionId = params.id;
	const filter = searchParams.filter;
	const page = searchParams.page ? +searchParams.page : 1;
	const { userId } = auth();
	let currUser;

	if (userId) {
		currUser = await getUserById({ userId });
	}

	const result = await getQuestionById({ questionId });

	return (
		<>
			<div className='flex-start w-full flex-col'>
				<div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
					<Link href={`profile/${result.author.clerkId}`} className='flex-start gap-1'>
						<Image src={result.author.picture} alt='user' width={22} height={22} className='rounded-full object-contain' />
						<p className='paragraph-semibold text-dark300_light700'>{result.author.name}</p>
					</Link>

					<div className='flex justify-end'>
						<Vote
							type='question'
							itemId={JSON.stringify(result._id)}
							userId={JSON.stringify(currUser?._id)}
							upVotes={result.upVotes.length}
							hasUpVoted={result.upVotes.includes(currUser?._id)}
							downVotes={result.downVotes.length}
							hasDownVoted={result.downVotes.includes(currUser?._id)}
							hasSaved={currUser?.saved.includes(result._id)}
						/>
					</div>
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

			<AllAnswers questionId={result._id} userId={currUser?._id} totalAnswers={result.answers.length} filter={filter} page={page} />

			<Answer question={result.content} questionId={JSON.stringify(result._id)} authorId={JSON.stringify(currUser?._id)} />
		</>
	);
};

export default QuestionPage;
