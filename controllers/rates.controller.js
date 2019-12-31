const { Rates } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, rate;
    let user = req.user;

let rateData= {
    Rate: req.body.Rate
};

let rate_info = rateData;


let findrate=  await to(Rates.findAndCountAll());

let getRate= findrate[1].count;

    if (getRate == 0) {
        [err, rate] = await to(Rates.create(rate_info));
        if(err) return ReE( err, 422);
    
        [err, rate] = await to(rate.save());
        if(err) return ReE(res, err, 422);

        let business_json = rate.toWeb();
  
        return ReS(res, {rate:business_json}, 201);
    }
    else {

     Rates.update(
        {Rate: req.body.Rate},
        {where: {id:1}}
      )
        return ReS(res, "User Rate Updated", 200);
    }
}
module.exports.create = create;
