module.exports = (sequelize, DataTypes) => {
  let post = sequelize.define('post', {
      postid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps:true
    });

    post.associate = function(models) {
      post.belongsTo(models.user, {
            foreignKey: 'author',
        });
    };

    return post;
  };