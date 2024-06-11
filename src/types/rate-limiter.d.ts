export type Vendors = 'ipstack' | 'ipdata';
export type TokenBucket = {
	tokens: number;
	lastRefill: number;
};
export type Limits = {
	maxTokens: number;
	refillRate: number;
};
