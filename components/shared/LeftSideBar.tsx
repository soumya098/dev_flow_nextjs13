'use client';
import React from 'react';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedOut, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const LeftSideBar = () => {
	const pathName = usePathname();
	const { userId } = useAuth();
	console.log(userId);

	return (
		<section className='background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen w-fit flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
			<div className='flex flex-1 flex-col gap-6'>
				{sidebarLinks.map((sidebarLink) => {
					const isActive = sidebarLink.route === pathName || (pathName.includes(sidebarLink.route) && sidebarLink.route.length > 1);

					if (sidebarLink.route === '/profile') {
						if (userId) {
							sidebarLink.route = `${sidebarLink.route}/${userId}`;
						} else {
							return null;
						}
					}

					return (
						<div key={sidebarLink.route} className='flex flex-1 flex-col gap-6'>
							<Link
								href={sidebarLink.route}
								className={`flex items-center justify-start gap-4 ${
									isActive ? 'primary-gradient text-light-900' : 'text-dark300_light900'
								} rounded-lg bg-transparent p-4`}>
								<Image src={sidebarLink.imgURL} alt={sidebarLink.label} width={20} height={20} className={`${isActive ? '' : 'invert-colors'}`} />
								<p className={`${isActive ? 'base-bold' : 'base-medium'} max-lg:hidden`}>{sidebarLink.label}</p>
							</Link>
						</div>
					);
				})}
			</div>

			<SignedOut>
				<div className='flex flex-col gap-3'>
					<Link href='/sign-in'>
						<Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
							<Image src='/assets/icons/account.svg' alt='login' width={20} height={20} className='invert-colors lg:hidden' />
							<span className='primary-text-gradient max-lg:hidden'>Log In</span>
						</Button>
					</Link>

					<Link href='/sign-up'>
						<Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none'>
							<Image src='/assets/icons/sign-up.svg' alt='sign-in' width={20} height={20} className='invert-colors lg:hidden' />
							<span className='max-lg:hidden'>Sign Up</span>
						</Button>
					</Link>
				</div>
			</SignedOut>
		</section>
	);
};

export default LeftSideBar;
