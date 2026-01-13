import dotenv from 'dotenv';

dotenv.config();

interface Config {
  urlAPI: string | undefined;
  baseUrl: string | undefined;
  port: number;
  nodeEnv: string | undefined;
  apikey: string | undefined
}

const config: Config = {
    urlAPI : process.env.URL_API,
    baseUrl : process.env.BASE_URL,
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    apikey : process.env.GEMINI_API_KEY
};

export default config;