import dotenv from 'dotenv';

dotenv.config();

interface Config {
  urlAPI: string;
  baseUrl: string;
  port: number;
  nodeEnv: string;
}

const config: Config = {
    urlAPI : process.env.URL_API || 'http://localhost:4200',
    baseUrl : process.env.BASE_URL || '/summarizer-api',
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'dev',
};

export default config;