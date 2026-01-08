import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config';
// import BudgetModel from './budget_model';
// import DepenseModel from './depense_model';
// import RevenuModel from './revenu_model';

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
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

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export interface Db {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
//   Budget: ReturnType<typeof BudgetModel>;
//   Depense: ReturnType<typeof DepenseModel>;
//   Revenu: ReturnType<typeof RevenuModel>;
}

const db: Db = {
  sequelize,
  Sequelize,
//   Budget: BudgetModel(sequelize),
//   Depense: DepenseModel(sequelize),
//   Revenu: RevenuModel(sequelize),
};

export default db;
