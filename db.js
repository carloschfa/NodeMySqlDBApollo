import Sequelize from 'sequelize';
import _ from 'lodash';
const Conn = new Sequelize(
  'upwork',
  'root',
  'root_password',
  {
    dialect: 'mysql',
    host: '18.230.76.227'
  }
);

const ObjectItem = Conn.define('Objects', {
  objectId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  number: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  boolean: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.STRING,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.STRING,
    allowNull: true
  }
},
{ 
  timestamps: false
});

Conn.sync({ force: false }).then(() => {
  
});

export default Conn;