'use client';
import { downVoteQuestion, upVoteQuestion } from '@/lib/actions/question.action';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { downVoteAnswer, upVoteAnswer } from '@/lib/actions/answer.action';
import { toggleSaveQuestion } from '@/lib/actions/user.action';
import { viewQuestion } from '@/lib/actions/interaction.action';
import { useToast } from '@/components/ui/use-toast';

interface Props {
	type: string;
	itemId: string;
	userId: string;
	upVotes: number;
	hasUpVoted: boolean;
	downVotes: number;
	hasDownVoted: boolean;
	hasSaved?: boolean;
}

const Vote = ({ upVotes, downVotes, type, itemId, userId, hasSaved, hasDownVoted, hasUpVoted }: Props) => {
	const pathName = usePathname();
	const router = useRouter();
	const { toast } = useToast();

	useEffect(() => {
		viewQuestion({ questionId: JSON.parse(itemId), userId: userId ? JSON.parse(userId) : undefined });
	}, [itemId, userId, pathName, router]);

	const handleSave = async () => {
		if (userId) {
			if (type === 'question') {
				await toggleSaveQuestion({ questionId: JSON.parse(itemId), userId: JSON.parse(userId), path: pathName });
			}
			toast({
				title: hasSaved ? 'Removed' : 'Saved'
			});
		} else {
			toast({
				title: 'Please Log In',
				description: 'You must be logged in to perform this action'
			});
		}
	};

	const handleUpVote = async () => {
		if (userId) {
			if (type === 'question') {
				await upVoteQuestion({ questionId: JSON.parse(itemId), userId: JSON.parse(userId), hasUpVoted, hasDownVoted, path: pathName });
			} else if (type === 'answer') {
				await upVoteAnswer({ answerId: JSON.parse(itemId), userId: JSON.parse(userId), hasUpVoted, hasDownVoted, path: pathName });
			}

			toast({
				title: `Upvote ${hasUpVoted ? 'Removed' : 'Successfull'}`,
				variant: hasUpVoted ? 'destructive' : 'default'
			});
		} else {
			toast({
				title: 'Please Log In',
				description: 'You must be logged in to perform this action'
			});
		}
	};

	const handleDownVote = async () => {
		if (userId) {
			if (type === 'question') {
				await downVoteQuestion({ questionId: JSON.parse(itemId), userId: JSON.parse(userId), hasUpVoted, hasDownVoted, path: pathName });
			} else if (type === 'answer') {
				await downVoteAnswer({ answerId: JSON.parse(itemId), userId: JSON.parse(userId), hasUpVoted, hasDownVoted, path: pathName });
			}

			toast({
				title: `Downvote ${hasDownVoted ? 'Removed' : 'Successfull'}`,
				variant: hasDownVoted ? 'destructive' : 'default'
			});
		} else {
			toast({
				title: 'Please Log In',
				description: 'You must be logged in to perform this action'
			});
		}
	};

	return (
		<div className='flex gap-5'>
			<div className='flex-center gap-2.5'>
				<div className='flex-center gap-1.5'>
					<Image
						src={hasUpVoted ? '/assets/icons/upvoted.svg' : '/assets/icons/upvote.svg'}
						width={18}
						height={18}
						alt='upVote'
						className='cursor-pointer'
						onClick={handleUpVote}
					/>
					<div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
						<p className='subtle-medium text-dark400_light900'>{formatNumber(upVotes)}</p>
					</div>
				</div>

				<div className='flex-center gap-1.5'>
					<Image
						src={hasDownVoted ? '/assets/icons/downvoted.svg' : '/assets/icons/downvote.svg'}
						width={18}
						height={18}
						alt='downVote'
						className='cursor-pointer'
						onClick={handleDownVote}
					/>
					<div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
						<p className='subtle-medium text-dark400_light900'>{formatNumber(downVotes)}</p>
					</div>
				</div>

				{type === 'question' && (
					<Image
						src={hasSaved ? '/assets/icons/star-filled.svg' : '/assets/icons/star-red.svg'}
						width={18}
						height={18}
						alt='star'
						className='cursor-pointer'
						onClick={handleSave}
					/>
				)}
			</div>
		</div>
	);
};

export default Vote;
