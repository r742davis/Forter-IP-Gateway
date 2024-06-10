import axios from 'axios';

async function getCountry(ip: string): Promise<string> {
	const res = await axios.get(`http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`);
	return res.data.country_name;
}

export default { getCountry };
