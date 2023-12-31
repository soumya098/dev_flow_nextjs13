import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import queryString from 'query-string';
import { BadgeCounts, BadgeParams, RemoveURLQueryParams, URLQueryParams } from '@/types';
import { BADGE_CRITERIA } from '@/constants';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getTimestamps = (date: Date): string => {
	const currentDate = new Date();
	const timeDifference = currentDate.getTime() - date.getTime();

	// Define time units in milliseconds
	const minute = 60 * 1000;
	const hour = 60 * minute;
	const day = 24 * hour;
	const week = 7 * day;
	const month = 30 * day;
	const year = 365 * day;

	if (timeDifference < minute) {
		return 'just now';
	} else if (timeDifference < hour) {
		const minutesAgo = Math.floor(timeDifference / minute);
		return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
	} else if (timeDifference < day) {
		const hoursAgo = Math.floor(timeDifference / hour);
		return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
	} else if (timeDifference < week) {
		const daysAgo = Math.floor(timeDifference / day);
		return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
	} else if (timeDifference < month) {
		const weeksAgo = Math.floor(timeDifference / week);
		return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
	} else if (timeDifference < year) {
		const monthsAgo = Math.floor(timeDifference / month);
		return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
	} else {
		const yearsAgo = Math.floor(timeDifference / year);
		return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
	}
};

export const formatNumber = (number: number): string => {
	if (number >= 100000) {
		return `${(number / 1000000).toFixed(1)}M`;
	} else if (number >= 1000) {
		return `${(number / 1000).toFixed(1)}K`;
	} else {
		return number.toString();
	}
};

export const getJoinedDate = (date: Date): string => {
	const month = date.toLocaleString('default', { month: 'long' });
	const year = date.getFullYear();
	const joinedDate = `Joined ${month} ${year}`;
	return joinedDate;
};

export const createUrl = ({ params, key, value }: URLQueryParams): string => {
	const currUrl = queryString.parse(params);
	currUrl[key] = value;

	return queryString.stringifyUrl({ url: window.location.pathname, query: currUrl }, { skipNull: true });
};

export const removeKeysFromQuery = ({ params, keys }: RemoveURLQueryParams): string => {
	const currUrl = queryString.parse(params);
	keys.forEach((key) => {
		delete currUrl[key];
	});

	return queryString.stringifyUrl({ url: window.location.pathname, query: currUrl }, { skipNull: true });
};

export const assignBadges = (params: BadgeParams) => {
	const { criteria } = params;
	const badgeCounts: BadgeCounts = {
		GOLD: 0,
		SILVER: 0,
		BRONZE: 0
	};

	criteria.forEach((criterion) => {
		const { type, count } = criterion;
		const badgeLevels: any = BADGE_CRITERIA[type];

		Object.keys(badgeLevels).forEach((level) => {
			if (count >= badgeLevels[level]) {
				badgeCounts[level as keyof BadgeCounts] += 1;
			}
		});
	});

	return badgeCounts;
};
