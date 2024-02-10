'use client';
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/lib/utils';

interface Props {
	options: {
		name: string;
		value: string;
	}[];
	otherClasses?: string;
}
const Filter = ({ options, otherClasses }: Props) => {
	const searchParams = useSearchParams();
	const filter = searchParams.get('filter');
	const router = useRouter();

	const handleUpdateFilter = (value: string) => {
		const newUrl = createUrl({ params: searchParams.toString(), key: 'filter', value });
		router.push(newUrl, { scroll: false });
	};

	return (
		<>
			<Select onValueChange={(value) => handleUpdateFilter(value)} defaultValue={filter || ''}>
				<SelectTrigger className={`${otherClasses} body-regular no-focus background-light800_dark300 text-dark500_light700 light-border px-5 py-3`}>
					<div className='line-clamp-1 flex-1 text-left'>
						<SelectValue placeholder='Select a Filter' />
					</div>
				</SelectTrigger>
				<SelectContent className='background-light800_dark300 text-dark500_light700 light-border'>
					<SelectGroup>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value} className='focus:bg-light-900 dark:focus:bg-dark-400'>
								{option.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	);
};

export default Filter;
