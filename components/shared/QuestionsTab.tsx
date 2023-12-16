import { getUserQuestions } from '@/lib/actions/user.action';
import React from 'react';
import QuestionCard from '../cards/QuestionCard';
import { SearchParamsProps } from '@/types';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
	userId: string;
	clerkId?: string;
}

const QuestionsTab = async ({ userId, clerkId, searchParams }: Props) => {
	const page = searchParams.page ? +searchParams.page : 1;
	const result = await getUserQuestions({ userId, page });

	return (
		<div className='mt-5 flex w-full flex-col gap-6'>
			{result?.questions.map((question) => (
				<QuestionCard
					key={question._id}
					author={question.author}
					answers={question.answers}
					id={question._id}
					title={question.title}
					tags={question.tags}
					views={question.views}
					upVotes={question.upVotes}
					createdAt={question.createdAt}
					clerkId={clerkId}
				/>
			))}

			<Pagination isNext={result?.isNext} pageNumber={page} />
		</div>
	);
};

export default QuestionsTab;
