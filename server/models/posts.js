module.exports = (sequelize, DataTypes) => {
    const posts = sequelize.define("posts", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    posts.associate = (models) => {
        posts.hasMany(models.comments, {
            onDelete: "cascade"
        });
        posts.hasMany(models.likes, {
            onDelete: "cascade"
        });
    };

    return posts;
};