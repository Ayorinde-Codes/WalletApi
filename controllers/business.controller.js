const { Business } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    let err, business;
    let user = req.user;

let businessData= {
    BusinessName: req.body.BusinessName,
    BusinessSector: req.body.BusinessSector,
    RcNumber: req.body.RcNumber,
    BusinessEmail: req.body.BusinessEmail,
    Address: req.body.Address,
    EmployeeNumber: req.body.EmployeeNumber,
    DirectorsNumber: req.body.DirectorsNumber,
    Phone: req.body.Phone,
    EmployeeNumber: req.body.EmployeeNumber,
    UserId : user.id
};

let business_info = businessData;

let businessId=  await to(Business.findAndCountAll({where:{UserId:business_info.UserId}}));

  if (businessId > 0) {

        return ReE(err, "User Business Already Exist", 422);
    }

    [err, business] = await to(Business.create(business_info));
    if(err) return ReE( err, 422);

   
    [err, business] = await to(business.save());
    if(err) return ReE(res, err, 422);

    let business_json = business.toWeb();
    business_json.users = [{user:user.id}];

    return ReS(res, {business:business_json}, 201);
}
module.exports.create = create;


const get = function(req, res){
    let business = req.business;

    return ReS(res, {business:business.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
    let err, business, data;
    business = req.business;
    data = req.body;
    business.set(data);

    [err, business] = await to(business.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {business:business.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
    let business, err;
    business = req.business;

    [err, business] = await to(business.destroy());
    if(err) return ReE(res, 'error occured trying to delete the company');

    return ReS(res, {message:'Deleted Company'}, 204);
}
module.exports.remove = remove;