import { getUserInfo } from '@/lib/actions/user.action';
import { URLProps } from '@/types';
import { SignedIn, auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJoinedDate } from '@/lib/utils';
import ProfileLink from '@/components/shared/ProfileLink';
import Stats from '@/components/shared/Stats';

const page = async ({ params, searchParams }: URLProps) => {
	const userInfo = await getUserInfo({ userId: params.id });
	const { userId: clerkId } = auth();
	console.log(userInfo);

	return (
		<>
			<div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
				<div className='flex flex-col items-start gap-4 lg:flex-row'>
					<Image src={userInfo?.user.picture} alt='profile' width={140} height={140} className='rounded-full object-contain' />
					<div className='mt-3'>
						<h2 className='h2-bold text-dark100_light900'>{userInfo?.user.name}</h2>
						<p className='paragraph-regular text-dark200_light800'>@{userInfo?.user.username}</p>

						<div className='flex-center mt-5 flex flex-wrap justify-start gap-5'>
							{userInfo?.user.website && <ProfileLink imgUrl='/assets/icons/link.svg' href={userInfo?.user.website} title='Portfolio' />}

							{userInfo?.user.location && <p>{userInfo?.user.location}</p>}

							<ProfileLink imgUrl='/assets/icons/calendar.svg' title={getJoinedDate(userInfo?.user.joinedAt)} />
						</div>

						{userInfo?.user.bio && <p className='paragraph-regular text-dark400_light800 mt-8'>{userInfo?.user.bio}</p>}
					</div>
				</div>

				<div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
					<SignedIn>
						{clerkId === userInfo?.user.clerkId && (
							<Link
								href={`/profile/edit`}
								className='btn-secondary paragraph-medium text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3 text-center'>
								Edit Profile
							</Link>
						)}
					</SignedIn>
				</div>
			</div>

			<Stats />

			<div className='mt-8 flex gap-10'>
				<Tabs defaultValue='question' className='w-[400px]'>
					<TabsList className='background-light800_dark400 min-h-[42px] p-2'>
						<TabsTrigger value='question' className='tab rounded-md'>
							Top Posts
						</TabsTrigger>
						<TabsTrigger value='answer' className='tab rounded-md'>
							Answers
						</TabsTrigger>
					</TabsList>
					<TabsContent value='question'>Posts</TabsContent>
					<TabsContent value='answer'>Answers</TabsContent>
				</Tabs>
			</div>
		</>
	);
};

export default page;
