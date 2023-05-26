const { User, Book } = require("../models/Models");
const Io = require("../utils/Io");
const { isAdmin } = require("../utils/utils");
const Books = new Io("./db/books.json");
const Authors = new Io("./db/authors.json");
const uuid = require("uuid");

exports.postBook = async (req, res) => {
  try {
    const authtoken = req.headers.auth;
    const myrole = await isAdmin(authtoken, "admin");
    if (!myrole) {
      return res.status(409).send({ message: "Forbidden!" });
    }
    const { title, authorId, category } = req.body;
    const id = uuid.v4();
    const books = await Books.read();

    const current = new Book(id, title, authorId, category);
    Books.write([...books, current]);
    res.status(200).send({ message: "Succcesfully added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.selectedBooks = async (req, res) => {
  try {
    const books = await Books.read();
    const category = req.query?.category;
    const authorId = req.query?.authorId;
    if (category) {
      const filtered = books.filter((book) => book.category === category);
      return res.status(200).send({ message: `${category} books`, filtered });
    }
    if (authorId) {
      const filtered = books.filter((book) => book.authorId === authorId);
      return res.status(200).send({ message: `${category} books`, filtered });
    }
    res.status(200).send({ message: "Succcesfully", books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.oneBook = async (req, res) => {
  try {
    const books = await Books.read();
    const id = req.params?.id;
    const finded = books.find((book) => book.id === id);
    const authors = await Authors.read();
    const findedAut = authors.find((author) => author.id === finded.authorId);
    finded.author = findedAut;
    res.status(200).send({ message: "Succcesfully", finded });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editBook = async (req, res) => {
  try {
    const authtoken = req.headers.auth;
    const myrole = await isAdmin(authtoken, "admin");
    if (!myrole) {
      return res.status(409).send({ message: "Forbidden!" });
    }
    const books = await Books.read();
    const id = req.params?.id;
    const finded = books.find((book) => book.id === id);
    const { title, authorId, category } = req.body;
    title?.length && (finded.title = title);
    authorId?.length && (finded.authorId = authorId);
    category?.length && (finded.category = category);
    Books.write(books);
    res.status(200).send({ message: "Succcesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delBook = async (req, res) => {
  try {
    const authtoken = req.headers.auth;
    const myrole = await isAdmin(authtoken, "admin");
    if (!myrole) {
      return res.status(409).send({ message: "Forbidden!" });
    }
    const id = req.params?.id;
    const books = await Books.read();
    const finded = books.find((book) => book.id === id);
    if (!finded) {
      return res.status(404).send({ message: "Book not found!" });
    }
    const filtered = books.filter((book) => book.id !== id);
    Books.write(filtered);
    res.status(200).send({ message: "Succcesfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
