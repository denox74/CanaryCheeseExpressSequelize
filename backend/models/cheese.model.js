module.exports = (sequelize, Sequelize) => {
    const Cheese = sequelize.define("cheese", {
        name: {
            type: Sequelize.STRING
        },
        curation:{
            type: Sequelize.STRING
        },
        weight:{
            type: Sequelize.FLOAT
        },
        origen: {
      type: Sequelize.STRING
    },
        filename: {
      type: Sequelize.STRING
    },
    // Relación con el usuario (clave foránea)
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,              
      references: {
        model: 'users',              
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  });

    return Cheese;
};