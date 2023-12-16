'use client';
import React from 'react';
import { Button } from '../ui/button';
import { createUrl } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
	pageNumber: number;
	isNext: boolean | undefined;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const handleNavigation = (dir: string) => {
		const updatedPageNumber = dir === 'next' ? pageNumber + 1 : dir === 'prev' ? pageNumber - 1 : pageNumber;

		const newUrl = createUrl({ params: searchParams.toString(), key: 'page', value: updatedPageNumber.toString() });
		router.push(newUrl);
	};

	if (!isNext && pageNumber === 1) return null;

	return (
		<div className='mt-10 flex w-full items-center justify-center gap-2'>
			<Button
				className='btn light-border-2 flex min-h-[36px] items-center justify-center gap-2 border'
				disabled={pageNumber === 1}
				onClick={() => handleNavigation('prev')}>
				<p className='body-medium text-dark200_light800'>Prev</p>
			</Button>

			<Button
				className='btn light-border-2 primary-gradient flex min-h-[36px] items-center justify-center gap-2 border'
				disabled={false}
				onClick={() => {}}>
				<p className='body-semibold text-light-900'>{pageNumber}</p>
			</Button>

			<Button
				className='btn light-border-2 flex min-h-[36px] items-center justify-center gap-2 border'
				disabled={!isNext}
				onClick={() => handleNavigation('next')}>
				<p className='body-medium text-dark200_light800'>Next</p>
			</Button>
		</div>
	);
};

export default Pagination;
