module.exports = (sequelize, Sequelize) => {
    const Cheese = sequelize.define("cheese", {
        name: {
            type: Sequelize.STRING
        },
        curation:{
            type: Sequelize.STRING
        }
    });
    return Cheese;
};