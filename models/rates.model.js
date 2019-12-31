const {TE, to}  = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Rates', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
  },
    Rate: DataTypes.STRING,
  });



  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};

