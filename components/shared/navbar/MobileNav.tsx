'use client';
import React from 'react';
import Image from 'next/image';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import NavContent from './NavContent';
import { SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const MobileNav = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Image src='/assets/icons/hamburger.svg' alt='menu' width={36} height={36} className='invert-colors sm:hidden' />
			</SheetTrigger>
			<SheetContent side={'left'} className='background-light900_dark300 border-none'>
				<Link href='/' className='flex items-center gap-2'>
					<Image src='/assets/images/site-logo.svg' width={25} height={25} alt='devFlowSite' />
					<p className='h2-bold text-dark100_light900 font-spaceGrotesk'>
						Dev<span className='text-primary-500'>Flow</span>
					</p>
				</Link>

				<div>
					<SheetClose asChild>
						<NavContent />
					</SheetClose>

					<SignedOut>
						<div className='flex flex-col gap-3'>
							<SheetClose asChild>
								<Link href='/sign-in'>
									<Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg  px-4 py-3 shadow-none'>
										<span className='primary-text-gradient'>Log In</span>
									</Button>
								</Link>
							</SheetClose>

							<SheetClose>
								<Link href='/sign-up'>
									<Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none'>
										Sign Up
									</Button>
								</Link>
							</SheetClose>
						</div>
					</SignedOut>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNav;
