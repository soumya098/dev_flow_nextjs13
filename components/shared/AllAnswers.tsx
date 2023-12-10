import React from 'react';
import Filter from './Filter';
import { AnswerFilters } from '@/constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { getTimestamps } from '@/lib/utils';
import ParseHtml from './ParseHtml';
import Vote from './Vote';

interface Props {
	questionId: string;
	userId: string;
	totalAnswers: number;
	page?: number;
	filter?: string | undefined;
}

const AllAnswers = async ({ questionId, userId, totalAnswers, filter }: Props) => {
	const result = await getAnswers({ questionId, filter });

	return (
		<div className='mt-10'>
			<div className='flex-between'>
				<h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>

				<div className='relative'>
					<Filter options={AnswerFilters} />
				</div>
			</div>

			<div className='mt-2'>
				{result.answers.map((answer) => (
					<article key={answer._id} className='light-border border-b py-10'>
						<div className=''>
							<div className='mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
								<Link href={`/profile/${answer.author.clerkId}`} className='flex flex-1 items-start gap-1 sm:items-center'>
									<Image src={answer.author.picture} alt='profile' width={18} height={18} className='rounded-full object-cover max-sm:mt-0.5' />
									<div className='flex flex-col sm:flex-row sm:items-center'>
										<p className='body-semibold text-dark300_light700 '>{answer.author.name}</p>
										<p className='small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1'>
											<span className='max-sm:hidden'> {' - '} </span>
											answered {getTimestamps(answer.createdAt)}
										</p>
									</div>
								</Link>
								<div className='flex justify-end'>
									<Vote
										type='answer'
										itemId={JSON.stringify(answer._id)}
										userId={JSON.stringify(userId)}
										upVotes={answer.upVotes.length}
										hasUpVoted={answer.upVotes.includes(userId)}
										downVotes={answer.downVotes.length}
										hasDownVoted={answer.downVotes.includes(userId)}
									/>
								</div>
							</div>

							<ParseHtml data={answer.content} />
						</div>
					</article>
				))}
			</div>
		</div>
	);
};

export default AllAnswers;
