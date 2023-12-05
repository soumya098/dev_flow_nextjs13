import Profile from '@/components/forms/Profile';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const page = async () => {
	const { userId } = auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const currUser = await getUserById({ userId });

	return (
		<div>
			<h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>

			<div className='mt-8'>
				<Profile clerkId={userId} user={JSON.stringify(currUser)} />
			</div>
		</div>
	);
};

export default page;
