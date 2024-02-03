import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
	return (
		<>
			<h1 className='h1-bold text-dark100_light900'> All Users</h1>

			<div className='mb-12 mt-10 flex flex-wrap items-center justify-between gap-5'>
				<Skeleton className='h-14 flex-1' />
				<Skeleton className='h-14 w-28' />
			</div>

			<section className='mt-10 flex w-full flex-wrap gap-4'>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
					<Skeleton key={item} className='h-60 w-full  rounded-2xl xs:w-[260px]' />
				))}
			</section>
		</>
	);
};

export default Loading;
