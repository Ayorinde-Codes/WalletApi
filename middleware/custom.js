const Business 			    = require('./../models').Business;
const { to, ReE, ReS } = require('../services/util.service');

let business = async function (req, res, next) {
    let business_id, err, business;
    business_id = req.params.business_id;

    [err, business] = await to(Business.findOne({where:{id:business_id}}));
    if(err) return ReE(res, "err finding business");

    if(!business) return ReE(res, "business not found with id: "+business_id);
    let user, users_array, users;
    user = req.user;
    [err, users] = await to(business.getUsers());

    users_array = users.map(obj=>String(obj.user));

    if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+app_id);

    req.business = business;
    next();
}
module.exports.business = business;