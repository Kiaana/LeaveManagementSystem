// pages/api/weather.js
import axios from 'axios';

export default async function handler(req, res) {
    const apiKey = process.env.NEXT_PUBLIC_AMAP_API_KEY; // 使用带有 NEXT_PUBLIC_ 前缀的环境变量
    const cityCode = '430121'; // 长沙县
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${apiKey}&city=${cityCode}&extensions=base`;
    console.log('Fetching weather data from:', url);
    try {
        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ status: '0', info: 'Failed to fetch weather data' });
    }
}