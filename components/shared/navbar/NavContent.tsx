'use client';
import React from 'react';
import { sidebarLinks } from '@/constants';
import { SheetClose } from '@/components/ui/sheet';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SidebarLink } from '@/types';

const NavContent = () => {
	const pathName = usePathname();

	const isActive = (item: SidebarLink) => {
		return item.route === pathName || (pathName.includes(item.route) && item.route.length > 1);
	};

	return (
		<section className='flex h-full flex-col gap-6 pt-16'>
			{sidebarLinks.map((sidebarLink) => (
				<SheetClose key={sidebarLink.route} asChild>
					<Link
						href={sidebarLink.route}
						className={`flex items-center justify-start gap-4 ${
							isActive(sidebarLink) ? 'primary-gradient text-light-900' : 'text-dark300_light900'
						} rounded-lg bg-transparent p-4`}>
						<Image
							src={sidebarLink.imgURL}
							alt={sidebarLink.label}
							width={20}
							height={20}
							className={`${isActive(sidebarLink) ? '' : 'invert-colors'}`}
						/>
						<p className={`${isActive(sidebarLink) ? 'base-bold' : 'base-medium'}`}>{sidebarLink.label}</p>
					</Link>
				</SheetClose>
			))}
		</section>
	);
};

export default NavContent;
