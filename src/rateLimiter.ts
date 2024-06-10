type Vendors = 'ipstack' | 'ipdata';
type TokenBucket = {
	tokens: number;
	lastRefill: number;
};
type Limits = {
	maxTokens: number;
	refillRate: number;
};

const VENDOR_OPTIONS: Record<Vendors, Limits> = {
	ipstack: {
		maxTokens: 50,
		refillRate: 2
	},
	ipdata: {
		maxTokens: 100,
		refillRate: 1
	}
};

const tokenBucketsMap = new Map<Vendors, TokenBucket>();

/**
 * Token Bucket method for handling bursts of traffic.
 *
 * @param vendor
 * @returns {boolean}
 */
function isRateLimited(vendor: Vendors): boolean {
	const currentTime = Date.now();

	if (!tokenBucketsMap.has(vendor)) {
		tokenBucketsMap.set(vendor, { tokens: VENDOR_OPTIONS[vendor].maxTokens, lastRefill: currentTime });
	}

	const bucket = tokenBucketsMap.get(vendor);
	const elapsed = (currentTime - bucket.lastRefill) / 1000;
	const tokensToAdd = Math.floor(elapsed * VENDOR_OPTIONS[vendor].refillRate);

	bucket.tokens = Math.min(VENDOR_OPTIONS[vendor].maxTokens, bucket.tokens + tokensToAdd);
	bucket.lastRefill = currentTime;

	if (bucket.tokens > 0) {
		bucket.tokens--;
		return false;
	} else return true;
}

export default { isRateLimited };
