const { Fundtransfers } = require('../models');
const { Wallet } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');
const crypto = require ('crypto-random-string');

// require('dotenv').config();

const CONFIG = require('../config/config');
var sender = require("../services/email");



const create = async function(req, res){
    let err, fund_transfer, wallet;
    let user = req.user;
    let reference= 'Trans-'+crypto({length: 8, type: 'base64'});

let transaferData= {
    Amount: req.body.Amount,
    Reference: reference,
    Beneficiary_Account_Number: req.body.BeneficiaryAccountNumber,
    Beneficiary_Account_Name: req.body.BeneficiaryAccountName,
    Beneficiary_Bank: req.body.BeneficiaryBank,
    Status: 'processing',
    Remarks: req.body.Remarks,
    UserId : user.id
};

let fund_transfers = transaferData;


    [err, fund_transfer] = await to(Fundtransfers.create(fund_transfers));
    if(err) return ReE( err, 422);
    if(fund_transfer) {
        var data = {  
            template_Id: CONFIG.TemplateIdTransaction,
            receiver: CONFIG.Boss_Mail,   
            subject: 'Transaction Request',   
            name: user.FirstName,
            token: reference,
            lastname:user.LastName,
            amount:req.body.Amount,
            bank:req.body.BeneficiaryBank,
            account_name:req.body.BeneficiaryAccountName,
            account_number:req.body.BeneficiaryAccountNumber,
            transaction_id:reference,
            date_initiated:new Date(),
            remarks:req.body.Remarks,
            email:user.Email
         };

        let getWallet=  await to(Wallet.findOne({where:{UserId:user.id},attributes: ['ActualAmount']}).then(project => { return project.get('ActualAmount')  }));

        let result1 = getWallet[0];

        let result2 = getWallet[1];

        let UserActualAmount= result1 ? null : result2 ; 


        if (data.amount <= UserActualAmount){
            console.log("amount allowed");
        }

        if (data.amount > UserActualAmount){
            console.log("Not allowed to make such a transaction");
        }

        console.log(UserActualAmount);


    sender.sendEmail(data);

    }
    [err, fund_transfer] = await to(fund_transfer.save());
    if(err) return ReE(res, err, 422);

    return ReS(res, {message:'Users Transfer Processing', fund_transfers}, 200);
}
module.exports.create = create;


const history = async function(req, res){
    let err, fund_transfer, wallet;
    let user = req.user;


    let transactionHistory= await to(Fundtransfers.findAll({
        attributes: ['Beneficiary_Account_Name', 'Beneficiary_Account_Number','Beneficiary_Bank', 'Amount', 'Status', 'Reference', 'Remarks', 'updatedAt'],  
        where: {UserId:user.id},
        order: [ [ 'id', 'DESC' ]]
    }));

    return ReS(res, {message:'Transaction History', transactionHistory }, 200);

}
module.exports.history= history;