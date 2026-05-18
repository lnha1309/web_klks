const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      // Railway proxy đôi khi yêu cầu SSL; đặt DB_SSL=true trong .env nếu cần
      ssl:
        process.env.DB_SSL === 'true'
          ? { require: true, rejectUnauthorized: false }
          : undefined,
      connectTimeout: 20000,
    },
  }
);

module.exports = sequelize;
