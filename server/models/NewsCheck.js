const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const NewsCheck = sequelize.define('NewsCheck', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  text: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  predictLabel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confidenceScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  explanation: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  timestamps: true,
});

User.hasMany(NewsCheck, { foreignKey: 'userId', as: 'checks' });
NewsCheck.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = NewsCheck;
