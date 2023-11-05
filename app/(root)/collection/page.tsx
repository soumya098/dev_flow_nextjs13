import QuestionCard from '@/components/cards/QuestionCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
// import { Button } from '@/components/ui/button';
import { QuestionFilters } from '@/constants/filters';
import { getAllSavedQuestions } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
// import Link from 'next/link';

const Collection = async () => {
	const { userId: clerkId } = auth();

	if (!clerkId) return null;

	const result = await getAllSavedQuestions({ clerkId });

	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>
			</div>

			<div className='mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchBar
					route='/'
					iconPosition='left'
					imgSrc='/assets/icons/search.svg'
					placeholder='Search For Questions....'
					otherClasses='flex-1'
				/>

				<div className='relative max-md:flex'>
					<Filter options={QuestionFilters} otherClasses='min-h-[56px] sm:min-w-[170px]' />
				</div>
			</div>

			<div className='mt-10 flex w-full flex-col gap-6'>
				{result.questions.length > 0 ? (
					result.questions.map((question: any) => (
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
						title='No Saved Question Found'
						desc='It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟'
						link='/'
						linkText='Explore Questions'
					/>
				)}
			</div>
		</>
	);
};

export default Collection;
