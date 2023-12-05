import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import AnswerCard from '../cards/AnswerCard';

interface Props extends SearchParamsProps {
	userId: string;
	clerkId?: string | null;
}

const AnswersTab = async ({ userId, clerkId, searchParams }: Props) => {
	const result = await getUserAnswers({ userId, page: 1 });

	return (
		<div className='mt-5 flex w-full flex-col gap-6'>
			{result?.answers.map((answer) => (
				<AnswerCard
					key={answer._id}
					id={answer._id}
					question={answer.question}
					author={answer.author}
					title={answer.question.title}
					upVotes={answer.upVotes.length}
					createdAt={answer.createdAt}
					clerkId={clerkId}
				/>
			))}
		</div>
	);
};

export default AnswersTab;
