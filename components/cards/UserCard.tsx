import Image from 'next/image';
import React from 'react';
import RenderTag from '../shared/RenderTag';
import Link from 'next/link';
import { getTopInteractedTags } from '@/lib/actions/tag.action';
import { Badge } from '../ui/badge';

interface Props {
	user: {
		_id: string;
		clerkId: string;
		name: string;
		username: string;
		picture: string;
	};
}

const UserCard = async ({ user }: Props) => {
	const userTags = await getTopInteractedTags({ userId: user._id });

	return (
		<Link href={`/profile/${user.clerkId}`} className='shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]'>
			<article className='background-light900_dark200 light-border flex-center w-full flex-col rounded-2xl border p-8'>
				<Image src={user.picture} alt={user.username} width={100} height={100} className='rounded-full object-contain' />

				<div className='mt-4 text-center'>
					<h3 className='sm:h3-semibold h3-bold text-dark200_light900 line-clamp-1'>{user.name}</h3>
					<p className='body-regular text-dark500_light500 mt-2'>@{user.username}</p>
				</div>

				<div className='mt-5'>
					{userTags.length > 0 ? (
						<div className='flex items-center gap-2'>
							{userTags.map((tag) => (
								<RenderTag key={tag._id} id={tag._id} name={tag.name} />
							))}
						</div>
					) : (
						<Badge>No tags yet</Badge>
					)}
				</div>
			</article>
		</Link>
	);
};

export default UserCard;
