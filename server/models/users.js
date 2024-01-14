module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    users.associate = (models) => {
        users.hasMany(models.posts, {
            onDelete: "cascade"
        });
        users.hasMany(models.comments, {
            onDelete: "cascade"
        });
        users.hasMany(models.likes, {
            onDelete: "cascade"
        });
    };

    return users;
};