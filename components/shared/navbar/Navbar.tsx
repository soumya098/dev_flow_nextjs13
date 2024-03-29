'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Theme from './Theme';
import MobileNav from './MobileNav';
import GlobalSearch from '../search/GlobalSearch';

const Navbar = () => {
	return (
		<nav className='flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12'>
			<Link href='/' className='flex items-center gap-2'>
				<Image src='/assets/images/site-logo.svg' width={25} height={25} alt='devFlowSite' />
				<p className='h2-bold text-dark100_light900 font-spaceGrotesk max-sm:hidden'>
					Dev<span className='text-primary-500'>Flow</span>
				</p>
			</Link>

			<GlobalSearch />

			<div className='flex-between gap-5'>
				<Theme />

				<SignedIn>
					<UserButton afterSignOutUrl='/' appearance={{ elements: { avatarBox: 'h-10 w-10' }, variables: { colorPrimary: '#FF7000' } }} />
				</SignedIn>

				<MobileNav />
			</div>
		</nav>
	);
};

export default Navbar;
