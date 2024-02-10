import { getUserInfo } from '@/lib/actions/user.action';
import { URLProps } from '@/types';
import { SignedIn, auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getJoinedDate } from '@/lib/utils';
import ProfileLink from '@/components/shared/ProfileLink';
import Stats from '@/components/shared/Stats';
import QuestionsTab from '@/components/shared/QuestionsTab';
import AnswersTab from '@/components/shared/AnswersTab';

const page = async ({ params, searchParams }: URLProps) => {
	const { userId: clerkId } = auth();
	const userInfo = await getUserInfo({ userId: params.id });

	return (
		<>
			<div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
				<div className='flex flex-col items-start gap-4 lg:flex-row'>
					<Image src={userInfo?.user.picture} alt='profile' width={140} height={140} className='rounded-full object-contain' />
					<div className='mt-3'>
						<h2 className='h2-bold text-dark100_light900'>{userInfo?.user.name}</h2>
						<p className='paragraph-regular text-dark200_light800'>@{userInfo?.user.username}</p>

						<div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
							{userInfo?.user.website && <ProfileLink imgUrl='/assets/icons/link.svg' href={userInfo?.user.website} title='Portfolio' />}

							{userInfo?.user.location && <ProfileLink imgUrl='/assets/icons/location.svg' title={userInfo.user.location} />}

							<ProfileLink imgUrl='/assets/icons/calendar.svg' title={getJoinedDate(userInfo?.user.joinedAt)} />
						</div>

						{userInfo?.user.bio && <p className='paragraph-regular text-dark400_light800 mt-8'>{userInfo.user.bio}</p>}
					</div>
				</div>

				<div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
					<SignedIn>
						{clerkId === userInfo?.user.clerkId && (
							<Link href={`/profile/edit`}>
								<Button className='btn-secondary paragraph-medium text-dark300_light900 h-9 min-h-[46px] min-w-[175px] px-4 py-3 text-center shadow'>
									Edit Profile
								</Button>
							</Link>
						)}
					</SignedIn>
				</div>
			</div>

			<Stats totalQuestions={userInfo?.totalQuestions} totalAnswers={userInfo?.totalAnswers} badges={userInfo?.badgeCounts} />

			<div className='mt-8 flex gap-10'>
				<Tabs defaultValue='question' className='flex-1'>
					<TabsList className='background-light800_dark400 min-h-[42px] p-2'>
						<TabsTrigger value='question' className='tab rounded-md'>
							Top Posts
						</TabsTrigger>
						<TabsTrigger value='answer' className='tab rounded-md'>
							Answers
						</TabsTrigger>
					</TabsList>
					<TabsContent value='question' className='flex w-full flex-col gap-6'>
						<QuestionsTab userId={userInfo?.user._id} clerkId={userInfo?.user.clerkId} searchParams={searchParams} />
					</TabsContent>
					<TabsContent value='answer' className='flex w-full flex-col gap-6'>
						<AnswersTab userId={userInfo?.user._id} clerkId={userInfo?.user.clerkId} searchParams={searchParams} />
					</TabsContent>
				</Tabs>

				<div className='flex min-w-[278px] max-lg:hidden'>
					<h4 className='h3-semibold text-dark200_light900'>Top Tags</h4>
					{/* TODO: get users top tags from interactions */}
				</div>
			</div>
		</>
	);
};

export default page;
