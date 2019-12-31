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


 let ids= walletrate[1].map(({ UserId }) => UserId);

 let ActAmount= walletrate[1].map(({ ActualAmount }) => ActualAmount);

console.log(ids);

console.log(ActAmount);

const arr = ids;

var newArray = [];

const rates= ratedwallet[1];

// Adds interest to all users at 11:00pm
var task = cron.schedule('59 23 * * *', () => {

    console.log('calculate the rate and interest for numero users');
    

arr.forEach(function(ActAmount) {
    newArray.push(ActAmount + rates);
});



console.log(newArray);

});

let result = walletrate[1].map(({ ActualAmount }) => ActualAmount);

// ids.forEach(item=>{
//     console.log(item + 23);

// });

// console.log(newArray);

// let result = yy.map(({ ActualAmount }) => ActualAmount);
// let ids= yy.map(({ id }) => id);
// // const arr = [1,2,3,4,5];
// const newArray = result.map(i => i*5.1);

// console.log(newArray);
// console.log(ids);
// console.log(result);

        // Wallet.update(
        //     {
        //         // attributes: ['Interest'],
        //         Interest: newArray}
        //   )

        //   Wallet.update(
        //     {Interest: result},
        //     {where: {UserId:ids}}
        //   )
        //     return ReS(res, "User Rate Updated", 200);

        // Wallet.bulkCreate(newArray, 
        //     {
        //         fields:["id", "Interest"] ,
        //         // updateOnDuplicate: ["Interest"] 
        //     } )


// cron to add interest to each users

 


    return ReS(res, {message:'Users Wallet Details', userWallet, LastFiveTransaction }, 200);
}
module.exports.get = get;

