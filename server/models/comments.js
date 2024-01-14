module.exports = (sequelize, DataTypes) => {
    const comments = sequelize.define("comments", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }  
    });

    comments.associate = (models) => {
        comments.hasMany(models.likes, {
            onDelete: "cascade"
        });
    };

    return comments;
};