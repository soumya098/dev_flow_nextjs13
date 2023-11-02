import UserCard from '@/components/cards/UserCard';
import Filter from '@/components/shared/Filter';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { UserFilters } from '@/constants/filters';
import { getAllUsers } from '@/lib/actions/user.action';
import Link from 'next/link';
import React from 'react';

const Community = async () => {
	const result = await getAllUsers({});

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
		</>
	);
};

export default Community;
