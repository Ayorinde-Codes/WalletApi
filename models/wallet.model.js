const {TE, to}  = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Wallet', {
    ActualAmount: DataTypes.DECIMAL(10, 2),
    InitialAmount: DataTypes.DECIMAL(10, 2),
  });

  Model.associate = function(models){
      this.Users = this.belongsTo(models.User);
  };

  Model.prototype.toWeb = function (pw) {
      let json = this.toJSON();
      return json;
  };

  return Model;
};

