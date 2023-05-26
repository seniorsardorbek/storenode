const { User } = require("../models/Models");
const Io = require("../utils/Io");
const Users = new Io("./db/users.json");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../utils/utils");

exports.register = async (req, res) => {
  try {
    const users = await Users.read();
    const { firstName, lastName, email, password } = req.body;
    const finded = users.find((u) => u.email === email);
    if (finded) {
      return res.status(409).send({ message: "Email is not a valid email!" });
    }
    const id = uuid.v4();
    const hashed = await bcrypt.hash(password, 12);
    const current = new User(
      id,
      firstName,
      lastName,
      email,
      hashed,
      "customer"
    );
    Users.write([...users, current]);
    const token = await jwt.sign({ id, role: "customer" }, process.env.JWT_SEC);
    res.status(200).send({ message: "Welcome to API", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.aregister = async (req, res) => {
  try {
    const authtoken = req.headers.auth;
    const myrole = await isAdmin(authtoken, "superAdmin");

    const users = await Users.read();
    const { firstName, lastName, email, password } = req.body;
    const finded = users.find((u) => u.email === email);
    if (!myrole) {
      return res.status(409).send({ message: "Forbidden!" });
    }
    if (finded) {
      return res.status(409).send({ message: "Email is not a valid email!" });
    }
    const id = uuid.v4();
    const hashed = await bcrypt.hash(password, 12);
    const current = new User(id, firstName, lastName, email, hashed, "admin");
    Users.write([...users, current]);
    const token = await jwt.sign({ id, role: "admin" }, process.env.JWT_SEC);
    res.status(200).send({ message: "Welcome to API", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const users = await Users.read();
    const { email, password } = req.body;
    const finded = users.find((u) => u.email === email);
    const verify = finded && (await bcrypt.compare(password, finded?.password));
    if (!verify) {
      return res
        .status(409)
        .send({ message: "Email or password is not a valid email!" });
    }
    const token = await jwt.sign(
      { id: finded.id, role: finded.role },
      process.env.JWT_SEC
    );
    res.status(200).send({ message: "Welcome to API", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const token = req.headers.auth;
    const role = req.query.role;
    const myrole = isAdmin(token, "admin");
    if (!myrole) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const users = await Users.read();
    if (role) {
      const filtered = users.filter((u) => u.role === role);
      return res.status(200).send({ message: "Users", data: filtered });
    }
    res.status(200).send({ message: "Users", data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userMe = async (req, res) => {
  try {
    const token = req.headers.auth;
    const id = await jwt.decode(token, { complete: true }).payload.id;

    const users = await Users.read();
    const finded = users.find((u) => u.id === id);
    if (!finded) {
      return res.status(403).send({ message: "Forbidden" });
    }
    res.status(200).send({ message: "User", data: finded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.edituserMe = async (req, res) => {
  try {
    const token = req.headers.auth;
    const id = await jwt.decode(token, { complete: true }).payload.id;

    const users = await Users.read();
    const finded = users.find((u) => u.id === id);
    if (!finded) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const { firstName, lastName, email, password } = req.body;
    firstName && (finded.firstName = firstName);
    lastName && (finded.lastName = lastName);
    email && (finded.email = email);
    const hashed = await bcrypt.hash(password , 12)
    password && (finded.password = hashed);
    Users.write(users)
    res.status(200).send({ message: "Updated succesfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userDel = async (req, res) => {
  try {
    const token = req.headers.auth;
    const id = req.params.id;
    const myrole = await isAdmin(token, "customer");
    if (myrole) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const users = await Users.read();
    const finded = users.find((u) => u.id === id);
    if (!finded) {
      return res.status(401).send({ message: "User not found" });
    }
    const filtered = users.filter((u) => u.id !== id);
    Users.write(filtered);
    res.status(200).send({ message: "Succesfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
