import QuestionCard from '@/components/cards/QuestionCard';
import HomeFilter from '@/components/home/HomeFilter';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import { getQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';
import Link from 'next/link';

const Home = async ({ searchParams }: SearchParamsProps) => {
	const filter = searchParams.filter;
	const searchQuery = searchParams.q;
	const result = await getQuestions({ filter, searchQuery });

	return (
		<>
			<div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
				<h1 className='h1-bold text-dark100_light900'>All Questions</h1>
				<Link href='/ask-question' className='flex items-center justify-end max-sm:w-full'>
					<Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>Ask a Question</Button>
				</Link>
			</div>

			<div className='mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchBar route='/' iconPosition='left' imgSrc='/assets/icons/search.svg' placeholder='Search for Questions' otherClasses='flex-1' />
				<div className='relative hidden max-md:flex'>
					<Filter options={HomePageFilters} otherClasses='min-h-[56px] sm:min-w-[170px]' />
				</div>
			</div>

			<HomeFilter />

			<div className='mt-10 flex w-full flex-col gap-6'>
				{result.questions.length > 0 ? (
					result.questions.map((question) => (
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
						title='There&#39;s no question to show'
						desc='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from.
            Get involved! 💡'
						link='/ask-question'
						linkText='Ask a Question'
					/>
				)}
			</div>
		</>
	);
};

export default Home;
