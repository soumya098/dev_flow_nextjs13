'use client';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createUrl, removeKeysFromQuery } from '@/lib/utils';

interface Props {
	route: string;
	iconPosition: string;
	imgSrc: string;
	placeholder: string;
	otherClasses: string;
}

const LocalSearchBar = ({ route, iconPosition, imgSrc, placeholder, otherClasses }: Props) => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.get('q');
	const [term, setTerm] = useState(query || '');

	useEffect(() => {
		const debounceFn = setTimeout(() => {
			if (term.length > 0) {
				const newUrl = createUrl({ params: searchParams.toString(), key: 'q', value: term });
				router.push(newUrl, { scroll: false });
			} else {
				if (pathName === route) {
					const newUrl = removeKeysFromQuery({ params: searchParams.toString(), keys: ['q'] });
					router.push(newUrl, { scroll: false });
				}
			}
		}, 800);

		return () => clearTimeout(debounceFn);
	}, [term, query, route, router, searchParams, pathName]);

	return (
		<div className='relative w-full'>
			<div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-xl px-4 ${otherClasses}`}>
				{iconPosition === 'left' && <Image src={imgSrc} width={24} height={24} alt='Search' className='cursor-pointer' />}
				<Input
					type='text'
					placeholder={placeholder}
					defaultValue={term}
					className='no-focus paragraph-regular placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
					onChange={(e) => {
						setTerm(e.target.value);
					}}
				/>
				{iconPosition === 'right' && <Image src={imgSrc} width={24} height={24} alt='Search' className='cursor-pointer' />}
			</div>
		</div>
	);
};

export default LocalSearchBar;
