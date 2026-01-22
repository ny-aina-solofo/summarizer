import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config';
import { DocumentModel } from './documents.model';

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port, 
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


export interface Db {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Documents: ReturnType<typeof DocumentModel>;
}

const db: Db = {
  sequelize,
  Sequelize,
  Documents: DocumentModel(sequelize),
};

export default db;
