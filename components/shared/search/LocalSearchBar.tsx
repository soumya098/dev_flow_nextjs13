'use client';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';

interface Props {
	route: string;
	iconPosition: string;
	imgSrc: string;
	placeholder: string;
	otherClasses: string;
}

const LocalSearchBar = ({ route, iconPosition, imgSrc, placeholder, otherClasses }: Props) => {
	return (
		<div className='relative w-full'>
			<div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-xl px-4 ${otherClasses}`}>
				{iconPosition === 'left' && <Image src={imgSrc} width={24} height={24} alt='Search' className='cursor-pointer' />}
				<Input
					type='text'
					placeholder={placeholder}
					className='no-focus paragraph-regular placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
					onChange={() => {}}
				/>
				{iconPosition === 'right' && <Image src={imgSrc} width={24} height={24} alt='Search' className='cursor-pointer' />}
			</div>
		</div>
	);
};

export default LocalSearchBar;
