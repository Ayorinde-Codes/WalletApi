require('dotenv').config();
const express 			= require('express');

const router 			= express.Router();

const UserController 	= require('../controllers/user.controller');
const BusinessController = require('../controllers/business.controller');
const WalletController = require('../controllers/wallet.controller');
const FundTransferController = require('../controllers/fundtransfer.controller');
const RateController = require('../controllers/rates.controller');
const HomeController 	= require('../controllers/home.controller');
const _ = require('lodash');

const {initializePayment, verifyPayment} = require('../services/paystack')(request);

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');

const CONFIG = require('../config/config');

// VerifyController
require('./../middleware/passport')(passport)
/* GET home page. */

router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Wallet API", data:{"version_number":"v1.0.0"}})
});



router.post(    '/users',                UserController.create);                                                    
router.get(     '/users',                passport.authenticate('jwt', {session:false}), UserController.get);        
router.put(     '/users',                passport.authenticate('jwt', {session:false}), UserController.update);     
router.delete(  '/users',                passport.authenticate('jwt', {session:false}), UserController.remove);     
router.post(    '/users/login',          UserController.login);

router.post(    '/business',             passport.authenticate('jwt', {session:false}), BusinessController.create);                  
// router.get(     '/business',             passport.authenticate('jwt', {session:false}), BusinessController.getAll);                  // R

router.get(     '/business/:business_id', passport.authenticate('jwt', {session:false}), custom.business, BusinessController.get);     
router.put(     '/businesss/:business_id', passport.authenticate('jwt', {session:false}), custom.business, BusinessController.update);  
router.delete(  '/businesss/:business_id', passport.authenticate('jwt', {session:false}), custom.business, BusinessController.remove);  


// get users wallet 
router.get('/wallet', passport.authenticate('jwt', {session:false}),WalletController.get);


// get users wallet 
router.post('/verify', passport.authenticate('jwt', {session:false}),UserController.verify);


//post transaction 
router.post('/fundtransfer', passport.authenticate('jwt', {session:false}),FundTransferController.create);

// Transaction History
router.get('/fundtransferhistory', passport.authenticate('jwt', {session:false}),FundTransferController.history);

//create a Rate 
router.post('/rate',  RateController.create);


router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard);


var request = require('request');


//********* BankList and Verification from paystack **********

router.get('/banklist', function(req, res){ 

    request.get('https://api.paystack.co/bank', function (error, response, body) {
        
      res.send(body)
    });

});

router.post('/bankverify', function(req, res){ 
  const paystackKey= CONFIG.PaystackTestSecret;
  // const request = require('request');
  let accountNumber= req.body.account_number;
  let bankCode= req.body.bank_code;

  const options = {
      url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'authorization': 'Bearer '+paystackKey
      },

      json: true 
  };

    request.get(options, function(err, resp, body) {

     res.send(body)
  });

});


router.post('/paystack/pay', (req, res) => {
  const form = _.pick(req.body,['amount','email','full_name']);

  form.metadata = {
      full_name : form.full_name
  }

  form.amount *= 100;

  initializePayment(form, (error, body)=>{
      if(error){
          //handle errors
          console.log(error);
          return;
     }
     response = JSON.parse(body);
     res.redirect(response.data.authorization_url)
  });
});

module.exports = router;