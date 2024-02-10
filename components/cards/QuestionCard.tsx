import Link from 'next/link';
import React from 'react';
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import { formatNumber, getTimestamps } from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';

interface Props {
	id: string;
	title: string;
	tags: {
		_id: string;
		name: string;
	}[];
	author: {
		_id: string;
		name: string;
		picture: string;
		clerkId: string;
	};
	views: number;
	upVotes: Array<object>;
	answers: Array<object>;
	createdAt: Date;
	clerkId?: string;
}

const QuestionCard = ({ clerkId, id, title, tags, author, views, upVotes, answers, createdAt }: Props) => {
	const showActionButtons = clerkId === author.clerkId;

	return (
		<div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
			<div className='flex flex-col-reverse items-start justify-between gap-6 sm:flex-row'>
				<div>
					<span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>{getTimestamps(createdAt)}</span>

					<Link href={`/question/${id}`}>
						<h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>{title}</h3>
					</Link>
				</div>

				<SignedIn>{showActionButtons && <EditDeleteAction type='Question' itemId={JSON.stringify(id)} />}</SignedIn>
			</div>

			<div className='mt-3 flex flex-wrap gap-2 '>
				{tags.map((tag) => (
					<RenderTag key={tag._id} id={tag._id} name={tag.name} />
				))}
			</div>

			<div className='flex-between mt-6 w-full flex-wrap gap-3'>
				<div className='flex'>
					<Metric
						imgUrl={author.picture}
						alt='user'
						value={author.name}
						title={` - asked ${getTimestamps(createdAt)}`}
						textStyles='body-medium text-dark400_light700'
						href={`/profile/${author._id}`}
						isAuthor
					/>
				</div>

				<div className='flex-between gap-3'>
					<Metric
						imgUrl='/assets/icons/like.svg'
						alt='upVotes'
						value={formatNumber(upVotes.length)}
						title=' Votes'
						textStyles='small-medium text-dark400_light800'
					/>
					<Metric
						imgUrl='/assets/icons/message.svg'
						alt='answers'
						value={formatNumber(answers.length)}
						title=' Answers'
						textStyles='small-medium text-dark400_light800'
					/>
					<Metric
						imgUrl='/assets/icons/eye.svg'
						alt='views'
						value={formatNumber(views)}
						title=' Views'
						textStyles='small-medium text-dark400_light800'
					/>
				</div>
			</div>
		</div>
	);
};

export default QuestionCard;
