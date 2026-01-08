import dotenv from "dotenv";
dotenv.config();

interface DbConfig {
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
}

const dbConfig: DbConfig = {
  host: process.env.HOST_CONNECTION || "localhost",
  username: process.env.USER_CONNECTION || "postgres",
  password: process.env.PASSWORD_CONNECTION || "postgres",
  database: process.env.DATABASE_CONNECTION || "summarizer_db",
  port: Number(process.env.PORT_CONNECTION) || 5433,
};

export default dbConfig;
