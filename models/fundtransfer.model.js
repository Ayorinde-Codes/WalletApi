const {TE, to}  = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Fundtransfers', {
    Amount: DataTypes.DECIMAL(10, 2),
    Reference: DataTypes.STRING,
    Beneficiary_Account_Number: DataTypes.STRING,
    Beneficiary_Account_Name: DataTypes.STRING,
    Beneficiary_Bank: DataTypes.STRING,
    Status: DataTypes.ENUM('successful','failed','processing','reversed'),
    Remarks: DataTypes.STRING,
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

