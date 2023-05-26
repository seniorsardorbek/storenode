const express =require("express");
const jwt = require("jsonwebtoken");
const Io = require("./Io");
const Users = new Io("./db/users.json");
exports.regValidator = (schema) => {
    /**
     * @param {express.Request} req
     */
    return (req, res, next) => {
      const result = schema.validate(req.body);
  
      if (result.error) {
     return   res.send({message: result.error.details[0].message});
  
      }
  
      next();
    };
  };

  exports.IsLogged = async (req, res, next) => {
    try {
      const token = req.headers.auth;
      const decode = await jwt.decode(token, { complete: true })?.payload;
      const users = await Users.read();
      const finded = users.find((u) => u.id === decode.id);
      if (!finded) {
        return res.status(403).send({message : "Invalid token"})
      }
      next()
    } catch (error) {
      console.log(error.message);
    }
  };