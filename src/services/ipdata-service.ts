import axios from 'axios';

async function getCountry(ip: string): Promise<string> {
	const res = await axios.get(`https://api.ipdata.co/${ip}?api-key=${process.env.IPDATA_API_KEY}`);
	return res.data.country_name;
}

export default { getCountry };
