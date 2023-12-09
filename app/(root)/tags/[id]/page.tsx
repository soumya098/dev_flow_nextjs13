import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { IQuestion } from '@/database/question.model';
import { getQuestionsByTagId } from '@/lib/actions/tag.action';
import { URLProps } from '@/types';
import React from 'react';

const TagPage = async ({ params, searchParams }: URLProps) => {
	const tagId = params?.id;
	const result = await getQuestionsByTagId({ tagId, page: 1, searchQuery: searchParams.q });

	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900'>{result.tagTitle}</h1>
			</div>

			<div className='mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchBar
					route={`/tags/${tagId}`}
					iconPosition='left'
					imgSrc='/assets/icons/search.svg'
					placeholder='Search For Questions....'
					otherClasses='flex-1'
				/>
			</div>

			<div className='mt-10 flex w-full flex-col gap-6'>
				{result.questions.length > 0 ? (
					result.questions.map((question: IQuestion) => (
						<QuestionCard
							key={question._id}
							id={question._id}
							title={question.title}
							tags={question.tags}
							author={question.author}
							upVotes={question.upVotes}
							views={question.views}
							answers={question.answers}
							createdAt={question.createdAt}
						/>
					))
				) : (
					<NoResult
						title='No Question Found'
						desc='It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟'
						link='/'
						linkText='Explore Questions'
					/>
				)}
			</div>
		</>
	);
};

export default TagPage;
