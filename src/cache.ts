import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 7200 });

function get(ip: string): string | undefined {
	return cache.get(ip);
}

function set(ip: string, country: string): void {
	cache.set(ip, country);
}

export default { get, set };
