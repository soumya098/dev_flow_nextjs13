import UserCard from '@/components/cards/UserCard';
import Filter from '@/components/shared/Filter';
import Pagination from '@/components/shared/Pagination';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { UserFilters } from '@/constants/filters';
import { getAllUsers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import Link from 'next/link';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Community | DevFlow',
	description: 'Community page of DevFlow',
	icons: {
		icon: '/assets/images/site-logo.svg'
	}
};

const Community = async ({ searchParams }: SearchParamsProps) => {
	const searchQuery = searchParams.q;
	const filter = searchParams.filter;
	const page = searchParams.page ? +searchParams.page : 1;
	const result = await getAllUsers({ searchQuery, filter, page });

	return (
		<>
			<h1 className='h1-bold text-dark100_light900'> All Users</h1>

			<div className='mt-10 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
				<LocalSearchBar
					route='/community'
					iconPosition='left'
					imgSrc='/assets/icons/search.svg'
					placeholder='Search for User'
					otherClasses='flex-1'
				/>

				<div>
					<Filter options={UserFilters} otherClasses='min-h-[56px] sm:min-w-[170px]' />
				</div>
			</div>

			<section className='mt-10 flex w-full flex-wrap gap-4'>
				{result.users.length > 0 ? (
					result.users.map((user) => <UserCard key={user._id} user={user} />)
				) : (
					<div className='paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center'>
						<p>No users yet</p>
						<Link href='/sign-up' className='mt-2 font-bold text-accent-blue'>
							Join to be the First
						</Link>
					</div>
				)}
			</section>

			<Pagination pageNumber={page} isNext={result.isNext} />
		</>
	);
};

export default Community;
