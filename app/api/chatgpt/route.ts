import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

export async function POST(req: Request) {
	const payload = await req.json();
	const question = payload.question;

	try {
		// const openai = new OpenAI({
		//   organization: 'org-04XMMm4HJZwCwVRflIysTSED'
		// });

		// const completion = await openai.chat.completions.create({
		//   messages: [
		//     { role: 'system', content: 'You are a helpful assistant.' },
		//     { role: 'user', content: `Tell me ${question}` }
		//   ],
		//   model: 'gpt-3.5-turbo'
		// });
		// console.log(completion.choices[0].message.content);

		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'You are a assistant' },
					{ role: 'user', content: `Tell me ${question}` }
				]
			})
		});

		const result = await res.json();
		return NextResponse.json({ message: 'OK', reply: result.choices[0].message.content });
	} catch (error) {
		return NextResponse.json({ error: error.message });
	}
}
