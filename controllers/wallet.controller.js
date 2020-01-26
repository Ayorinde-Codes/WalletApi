const { Wallet } = require('../models');
const { Fundtransfers } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const { Rates } = require('../models');

const cron = require('node-cron');

const get = async function(req, res){
    let user = req.user;

    let lastFiveTransaction= await to(Fundtransfers.findAll({
            attributes: ['Beneficiary_Account_Name', 'Beneficiary_Account_Number','Beneficiary_Bank', 'Amount', 'Status', 'Reference', 'Remarks', 'updatedAt'], 
            limit: 5, 
            where: {UserId:user.id},
            order: [ [ 'id', 'DESC' ]]
        }));

    let LastFiveTransaction= lastFiveTransaction[1];

        let userWallet=  await to(Wallet.findOne({
            attributes: ['ActualAmount', 'InitialAmount', 'UserId'],
            where:{UserId:user.id}
        }));



        let ratedwallet=  await to(Rates.findAll({
            attributes: ['Rate'], 
            raw:true,
        }));


        let walletrate=  await to(Wallet.findAll({
            attributes: ['ActualAmount', 'UserId'], 
            raw:true,

        }));



// cron job
var task = cron.schedule('59 23 * * *', () => {

    console.log('cron job');

});


    return ReS(res, {message:'Users Wallet Details', userWallet, LastFiveTransaction }, 200);
}
module.exports.get = get;

