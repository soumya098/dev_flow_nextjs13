import Link from 'next/link';
import React from 'react';
import Metric from '../shared/Metric';
import { formatNumber, getTimestamps } from '@/lib/utils';
import EditDeleteAction from '../shared/EditDeleteAction';
import { SignedIn } from '@clerk/nextjs';

interface Props {
	id: string;
	title: string;
	author: {
		_id: string;
		name: string;
		picture: string;
	};
	upVotes: number;
	question: object;
	createdAt: Date;
	clerkId?: string | null;
}

const AnswerCard = ({ id, clerkId, title, author, upVotes, createdAt, question }: Props) => {
	const showActionButtons = clerkId === author.clerkId;
	return (
		<div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
			<div className='flex flex-col-reverse items-start justify-between gap-6 sm:flex-row'>
				<div>
					<span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>{getTimestamps(createdAt)}</span>

					<Link href={`/question/${question._id}/#${id}`}>
						<h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>{title}</h3>
					</Link>
				</div>

				<SignedIn>{showActionButtons && <EditDeleteAction type='Answer' itemId={JSON.stringify(id)} />}</SignedIn>
			</div>

			<div className='flex-between mt-6 w-full flex-wrap gap-3'>
				<div className='flex'>
					<Metric
						imgUrl={author.picture}
						alt='user'
						value={author.name}
						title={` - answered ${getTimestamps(createdAt)}`}
						textStyles='body-medium text-dark400_light700'
						href={`/profile/${author._id}`}
						isAuthor
					/>
				</div>

				<div className='flex-between gap-3'>
					<Metric
						imgUrl='/assets/icons/like.svg'
						alt='upVotes'
						value={formatNumber(upVotes)}
						title=' Votes'
						textStyles='small-medium text-dark400_light800'
					/>
				</div>
			</div>
		</div>
	);
};

export default AnswerCard;
