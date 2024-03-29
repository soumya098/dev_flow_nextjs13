import QuestionCard from '@/components/cards/QuestionCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { QuestionFilters } from '@/constants/filters';
import { getAllSavedQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';

const Collection = async ({ searchParams }: SearchParamsProps) => {
	const { userId: clerkId } = auth();
	const searchQuery = searchParams.q;
	const page = searchParams.page ? +searchParams.page : 1;
	const filter = searchParams.filter;

	if (!clerkId) return null;

	const result = await getAllSavedQuestions({ clerkId, searchQuery, filter, page });

	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>
			</div>

			<div className='mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchBar
					route='/collection'
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

			<Pagination pageNumber={page} isNext={result.isNext} />
		</>
	);
};

export default Collection;
