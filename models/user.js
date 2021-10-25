module.exports = (sequelize, DataTypes) => {
  let user = sequelize.define('user', {
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt:{
      type: DataTypes.STRING
    }
  }, {
    timestamps:true
  });

  return user;
};