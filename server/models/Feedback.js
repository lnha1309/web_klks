const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const NewsCheck = require('./NewsCheck');

const Feedback = sequelize.define('Feedback', {
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
  checkId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: NewsCheck,
      key: 'id'
    }
  },
  actualLabel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

User.hasMany(Feedback, { foreignKey: 'userId' });
Feedback.belongsTo(User, { foreignKey: 'userId' });

NewsCheck.hasMany(Feedback, { foreignKey: 'checkId', as: 'feedbacks' });
Feedback.belongsTo(NewsCheck, { foreignKey: 'checkId' });

module.exports = Feedback;
