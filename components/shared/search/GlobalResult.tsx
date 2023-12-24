'use client';
import React, { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GlobalFilters from './GlobalFilters';
import { globalSearch } from '@/lib/actions/general.action';

const GlobalResult = () => {
	const searchParams = useSearchParams();
	const global = searchParams.get('global');
	const type = searchParams.get('type');
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState([]);

	useEffect(() => {
		const fetchResult = async () => {
			setResult([]);
			setIsLoading(true);
			try {
				const result = await globalSearch({ query: global, type });
				setResult(JSON.parse(result));
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		if (global) {
			fetchResult();
		}

		return () => {
			//
		};
	}, [global, type]);

	const renderLink = (type: string, id: string) => {
		switch (type) {
			case 'question':
				return `/${type}/${id}`;
			case 'tag':
				return `/tags/${id}`;
			case 'user':
				return `/profile/${id}`;
			case 'answer':
				return `/question/${id}`;
			default:
				return '/';
		}
	};

	return (
		<div className='background-light800_dark400 absolute top-full z-10 mt-3 w-full rounded-xl border py-5 shadow-sm'>
			<GlobalFilters />
			<div className='my-5 h-[1px] bg-light-700/50 dark:bg-dark-200/50'></div>
			<div className='space-y-5'>
				<p className='text-dark400_light900 paragraph-semibold px-5'>Top Match</p>

				{isLoading ? (
					<div className='flex-center flex-col px-5'>
						<ReloadIcon className='my-2 h-10 w-10 animate-spin text-primary-500' />
						<p className='body-regular text-dark200_light800'>Browsing the whole database....</p>
					</div>
				) : (
					<div className='flex flex-col gap-2'>
						{result.length > 0 ? (
							result.map((result: any, index: number) => (
								<Link
									key={index}
									href={renderLink(result.type, result.id)}
									className='flex w-full cursor-pointer flex-row items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50'>
									<Image src='/assets/icons/tag.svg' alt='tag' width={18} height={18} className='invert-colors mt-1 object-contain' />
									<div className='flex flex-col'>
										<p className='body-medium text-dark200_light800 line-clamp-1'>{result.title}</p>
										<p className='text-light400_light500 small-medium mt-1 font-bold capitalize'> {result.type}</p>
									</div>
								</Link>
							))
						) : (
							<div className='flex-center flex-col px-5'>
								<p className='text-dark200_light800 body-regular px-5 py-2.5'>Oops, No Results Found!</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GlobalResult;
