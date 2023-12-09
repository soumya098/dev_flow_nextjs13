import TagCard from '@/components/cards/TagCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { TagFilters } from '@/constants/filters';
import { getAllTags } from '@/lib/actions/tag.action';
import { SearchParamsProps } from '@/types';
import React from 'react';

const Tag = async ({ searchParams }: SearchParamsProps) => {
	const searchQuery = searchParams.q;
	const result = await getAllTags({ searchQuery });

	return (
		<>
			<h1 className='h1-bold text-dark100_light900'> Tags</h1>

			<div className='mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchBar route='/tags' iconPosition='left' imgSrc='/assets/icons/search.svg' placeholder='Search for Tags' otherClasses='flex-1' />

				<div>
					<Filter options={TagFilters} otherClasses='min-h-[56px] sm:min-w-[170px]' />
				</div>
			</div>

			<section className='mt-10 flex w-full flex-wrap gap-4'>
				{result.tags.length > 0 ? (
					result.tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
				) : (
					<NoResult title='No Tags Found' desc='It looks like there are no tags available' link='/ask-question' linkText='Ask a Question' />
				)}
			</section>
		</>
	);
};

export default Tag;
