import { createClient } from '@deepgram/sdk';
import dotenv from 'dotenv';

dotenv.config();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

if (!deepgramApiKey) {
  console.error('Missing Deepgram API key. Please check your .env file.');
  process.exit(1);
}

const deepgram = createClient(deepgramApiKey);

export default deepgram;