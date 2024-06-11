const axios = require('axios');

export default async function getIpAddress(): Promise<string> {
	try {
		const response = await axios.get('https://api.ipify.org?format=json');
		return response.data.ip;
	} catch (error) {
		console.error('Error fetching public IP address:', error);
		return '127.0.0.1';
	}
}
