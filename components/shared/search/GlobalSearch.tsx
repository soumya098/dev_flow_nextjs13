import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';

const GlobalSearch = () => {
	return (
		<div className='relative w-full max-w-[600px] max-lg:hidden'>
			<div className='background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-2 rounded-xl px-4'>
				<Image src='/assets/icons/search.svg' width={24} height={24} alt='Search' className='cursor-pointer' />
				<Input
					type='text'
					placeholder='Search anything globally'
					className='no-focus paragraph-regular placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
				/>
			</div>
		</div>
	);
};

export default GlobalSearch;
