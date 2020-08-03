import { Sequelize } from 'sequelize-typescript';

import { User } from '../src/models/User';


export const sequelize = new Sequelize({
  database: 'site-test',
  dialect: 'postgres',
  username: 'postgres',
  password: 'postgres',
  port: 5433,
  host: 'localhost',
  pool: {
    max: 5,
    min: 0,
    idle: 20000,
    acquire: 20000
  },
  define: {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  }
});

before(async () => 
{
  sequelize.addModels([
    User
  ]);

  await sequelize.sync({ force: true });
});