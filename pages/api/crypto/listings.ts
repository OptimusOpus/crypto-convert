// pages/api/crypto/listings.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_CMC_API_KEY;
    if (!apiKey) {
      // It's better to throw an error or return a specific status code
      // if the API key is not configured, rather than just logging.
      console.error('API key is not configured');
      return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100', {
      headers: { 
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
        // 'Accept-Encoding': 'identity' // This header might not be necessary and can sometimes cause issues.
                                      // Axios handles encoding automatically.
      },
    });

    // Cache the response for 5 minutes on the CDN and for client-side revalidation
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(response.data);
  } catch (error) {
    // Log the error for server-side debugging
    if (axios.isAxiosError(error)) {
      console.error('Axios API Error:', error.response?.data || error.message);
      return res.status(error.response?.status || 500).json({ error: 'Failed to fetch cryptocurrency data from CMC', details: error.response?.data });
    } else {
      console.error('Generic API Error:', error);
      return res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
    }
  }
}
