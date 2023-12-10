'use client';
import { HomePageFilters } from '@/constants/filters';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { createUrl, removeKeysFromQuery } from '@/lib/utils';

const HomeFilter = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const filterQuery = searchParams.get('filter');
	const [filterText, setFilterText] = useState('');

	useEffect(() => {
		if (filterText.length > 0) {
			const newUrl = createUrl({ params: searchParams.toString(), key: 'filter', value: filterText });
			router.push(newUrl, { scroll: false });
		} else {
			const newUrl = removeKeysFromQuery({ params: searchParams.toString(), keys: ['filter'] });
			router.push(newUrl, { scroll: false });
		}

		return () => {
			//
		};
	}, [filterText, router, searchParams]);

	return (
		<div className='mt-10 hidden flex-wrap items-center gap-3 md:flex'>
			{HomePageFilters.map((filter) => (
				<Button
					key={filter.value}
					onClick={() => {
						setFilterText(filter.value !== filterQuery ? filter.value : '');
					}}
					className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
						filterText === filter.value
							? 'bg-primary-100 text-primary-500 dark:bg-dark-300'
							: 'bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-500'
					}`}>
					{filter.name}
				</Button>
			))}
		</div>
	);
};

export default HomeFilter;
