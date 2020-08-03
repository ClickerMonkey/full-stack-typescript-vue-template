import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
  database: 'site',
  dialect: 'postgres',
  username: 'postgres',
  password: 'password',
  port: 5432,
  host: '127.0.0.1',
  pool: {
    max: 100,
    min: 0,
    idle: 20000,
    acquire: 20000
  },
  define: {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  },
  modelPaths: [__dirname + '/models']
});