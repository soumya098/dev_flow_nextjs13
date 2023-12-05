import Question from '@/components/forms/Question';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const page = async ({ params }: ParamsProps) => {
	const questionId = params?.id;
	const { userId } = auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const currUser = await getUserById({ userId });
	const question = await getQuestionById({ questionId });

	return (
		<div>
			<h1 className='h1-bold text-dark100_light900'>Edit Question</h1>

			<div className='mt-8'>
				<Question currUserId={JSON.stringify(currUser._id)} type='edit' questionDetails={JSON.stringify(question)} />
			</div>
		</div>
	);
};

export default page;
