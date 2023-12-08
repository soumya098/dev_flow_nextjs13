import React from 'react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface Props {
	id: string;
	name: string;
	count?: number;
	showCount?: boolean;
}

const RenderTag = ({ id, name, count, showCount }: Props) => {
	return (
		<Link href={`/tags/${id}`} className='flex items-center justify-between gap-2'>
			<Badge className='subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase'>{name}</Badge>
			{showCount && <p className='small-medium text-dark500_light700'>{count}</p>}
		</Link>
	);
};

export default RenderTag;
