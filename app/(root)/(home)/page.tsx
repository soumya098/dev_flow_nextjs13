import HomeFilter from '@/components/home/HomeFilter';
import Filter from '@/components/shared/Filter';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import Link from 'next/link';

const Home = () => {
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
		</>
	);
};

export default Home;
