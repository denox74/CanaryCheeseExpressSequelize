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
    }

    });
    return Cheese;
};