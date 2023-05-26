const Joi = require('joi')

exports.userRegisterJoi = Joi.object({
  firstName : Joi.string().required().min(1),
  lastName : Joi.string().required().min(1),
  email : Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});
exports.userEditJoi = Joi.object({
  firstName : Joi.string().optional(),
  lastName : Joi.string().optional(),
  email : Joi.string().email({ tlds: { allow: false } }).optional(),
  password: Joi.string().min(6).optional()
});
exports.userLoginJoi = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().required(),
  password: Joi.string().min(6).required(),
});


exports.createBook = Joi.object({
  title: Joi.string().required(),
  authorId :  Joi.string().required(),
  category : Joi.string().valid("badiiy", "biznes","ilm-fan" , "siyosat" ,"boshqa").required()
});
exports.authorJoi = Joi.object({
  id: Joi.string().required(),
  name :  Joi.string().required()
});


exports.authorEditJoi = Joi.object({
  id: Joi.string().optional(),
  name :  Joi.string().optional()
});
exports.editBooks = Joi.object({
  title: Joi.string().optional(),
  authorId :  Joi.string().optional() ,
  category : Joi.string().valid("badiiy", "biznes","ilm-fan" , "siyosat" ,"boshqa").optional()
});


