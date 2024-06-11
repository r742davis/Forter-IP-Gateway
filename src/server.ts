import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cache from './cache';
import rateLimiter from './rate-limiter';
import { getIpAddress, ipdataService, ipstackService } from '@services';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Port ${PORT}: Server is running`);
});

app.get('/country', async (req: Request, res: Response) => {
	const ip = req.ip === process.env.LOCAL_IPV4 || req.ip === process.env.LOCAL_IPV6 ? await getIpAddress() : req.ip;

	if (!ip || typeof ip !== 'string') return res.status(400).json({ error: `Please enter an IP Address in string format - Requested Address: ${ip}` });

	const cachedIp = cache.get(ip);
	if (cachedIp) return res.json({ country: cachedIp, cached: true });

	try {
		let country: undefined | string;
		if (!rateLimiter.isRateLimited('ipstack')) country = await ipstackService.getCountry(ip);
		else if (!rateLimiter.isRateLimited('ipdata')) country = await ipdataService.getCountry(ip);
		else return res.status(429).json({ error: 'All vendors are rate limited currently' });

		if (country) {
			cache.set(ip, country);
			res.json({ country });
		} else res.status(500).json({ error: 'Could not fetch country' });
	} catch (error) {
		res.status(500).json({ error: `Error Occurred: ${error}` });
	}
});
