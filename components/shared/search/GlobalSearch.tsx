'use client';
import { Input } from '@/components/ui/input';
import { createUrl, removeKeysFromQuery } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const query = searchParams.get('global');
	const [term, setTerm] = useState(query || '');
	const [isOpen, setIsOpen] = useState(false);
	const searchContainerRef = useRef(null);

	useEffect(() => {
		const handleOutsideClick = (event: any) => {
			// @ts-ignore
			if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
				setIsOpen(false);
				setTerm('');
			}
		};

		setIsOpen(false);
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [pathName]);

	useEffect(() => {
		const debounceFn = setTimeout(() => {
			if (term.length > 0) {
				const newUrl = createUrl({ params: searchParams.toString(), key: 'global', value: term });
				router.push(newUrl, { scroll: false });
			} else {
				if (query) {
					const newUrl = removeKeysFromQuery({ params: searchParams.toString(), keys: ['global', 'type'] });
					router.push(newUrl, { scroll: false });
				}
			}
		}, 100);

		return () => clearTimeout(debounceFn);
	}, [term, router, pathName, searchParams, query]);

	return (
		<div className='relative w-full max-w-[600px] max-lg:hidden' ref={searchContainerRef}>
			<div className='background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-2 rounded-xl px-4'>
				<Image src='/assets/icons/search.svg' width={24} height={24} alt='Search' className='cursor-pointer' />
				<Input
					type='text'
					defaultValue={term}
					onChange={(e) => {
						setTerm(e.target.value);
						if (!isOpen) setIsOpen(true);
						if (e.target.value === '' && isOpen) {
							setIsOpen(false);
						}
					}}
					placeholder='Search anything globally'
					className='no-focus paragraph-regular placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
				/>
			</div>

			{isOpen && <GlobalResult />}
		</div>
	);
};

export default GlobalSearch;
