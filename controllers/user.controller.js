const crypto = require ('crypto-random-string');
 
require('dotenv').config();

var sender = require("../services/email");

const { User }  = require('../models');
var { Wallet }  = require('../models');
const authService       = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');


const create = async function(req, res){
  let Otp= crypto({length: 10});
  let acctNumber= '02'+crypto({length: 8, characters: '1234567890'});;

    let registerData= {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        password: req.body.password,
        OTP: Otp,
        AccountNumber: acctNumber
    };
    const body = registerData;

    if(!body.unique_key && !body.Email ){
        return ReE(res, 'Please enter an email to register.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password to register.');
    }else{
        let err, user;

        [err, user] = await to(authService.createUser(body));

        if(err) return ReE(res, err, 422);

        var data = {  
            template_Id: process.env.TemplateId,
            receiver: user.Email,   
            subject: 'Confirmation Token',   
            name: user.FirstName,
            token: Otp
         };

         //pass the data object to send the email
        sender.sendEmail(data);

    // creates a walletfor every user
    let wallet_info= {
        InitialAmount: 0.00,
        ActualAmount: 0.00,
        Interest: 0.00,
        UserId: user.id
    };
        Wallet.create(wallet_info);

        return ReS(res, {message:'Successfully created new user.', user:user.toWeb(), token:user.getJWT()}, 201);
    }
}
module.exports.create = create;

const get = async function(req, res){
    let user = req.user;

    return ReS(res, {user:user.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address is already in use';
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: '+user.Email});
}
module.exports.update = update;

const remove = async function(req, res){
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');

    return ReS(res, {message:'Deleted User'}, 204);
}
module.exports.remove = remove;


const login = async function(req, res){
    const body = req.body;
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;

// verify otp and confirm email
const verify= async function (req, res){

        let err, user, data
        user = req.user;
        userOtp = req.body.Otp;

        let dataOtp = user._previousDataValues.OTP;

        if(dataOtp == userOtp){

            let newData= {
                EmailConfirm:true
            }

            user.set(newData);
            user.save();

            return ReS(res, {message :'User Account confirmed'}, 200);
        }
        else{
            return ReE(res, "OTP Mismatch", 422);
        }

}
module.exports.verify= verify;