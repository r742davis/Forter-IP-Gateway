import { Vendors, TokenBucket } from '@types';
import { VENDOR_OPTIONS } from './global';

const tokenBucketsMap = new Map<Vendors, TokenBucket>();

/**
 * Token Bucket method for handling bursts of traffic.
 *
 * @param vendor
 * @returns {boolean}
 */
function isRateLimited(vendor: Vendors): boolean {
	const currentTime = Date.now();
	initializeTokenBucket(vendor, currentTime);

	const bucket = tokenBucketsMap.get(vendor)!;
	const elapsed = (currentTime - bucket.lastRefill) / 1000;
	const tokensToAdd = Math.floor(elapsed * VENDOR_OPTIONS[vendor].refillRate);

	bucket.tokens = Math.min(VENDOR_OPTIONS[vendor].maxTokens, bucket.tokens + tokensToAdd);
	bucket.lastRefill = currentTime;

	if (bucket.tokens > 0) {
		bucket.tokens--;
		return false;
	} else return true;
}

function initializeTokenBucket(vendor: Vendors, currentTime: number) {
	if (!tokenBucketsMap.has(vendor)) {
		tokenBucketsMap.set(vendor, {
			tokens: VENDOR_OPTIONS[vendor].maxTokens,
			lastRefill: currentTime
		});
	}
}

export default { isRateLimited };
