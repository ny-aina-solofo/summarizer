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
  host: process.env.HOST_CONNECTION || "",
  username: process.env.USER_CONNECTION || "",
  password: process.env.PASSWORD_CONNECTION || "",
  database: process.env.DATABASE_CONNECTION || "",
  port: Number(process.env.PORT_CONNECTION),
};

export default dbConfig;
