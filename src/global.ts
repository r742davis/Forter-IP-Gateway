import { Limits, Vendors } from '@types';

export const SECONDS_IN_AN_HOUR = 3600;
export const VENDOR_OPTIONS: Record<Vendors, Limits> = {
	ipstack: {
		maxTokens: 50,
		refillRate: 50 / SECONDS_IN_AN_HOUR
	},
	ipdata: {
		maxTokens: 100,
		refillRate: 100 / SECONDS_IN_AN_HOUR
	}
};
