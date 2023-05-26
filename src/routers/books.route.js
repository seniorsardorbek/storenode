const router = require("express").Router();
// const { homeGet } = require("../controller/auth.controller");
const { postBook, selectedBooks , oneBook, editBook, delBook } = require("../controller/books.controller");
const { createBook, editBooks } = require("../utils/schemes");
const {regValidator, IsLogged} = require('../utils/validators')
const booksValid = regValidator(createBook)
const editBooksValid = regValidator(editBooks)
router.post("/books",[ IsLogged,booksValid], postBook);
router.get("/books/?", IsLogged ,selectedBooks);
router.get("/books/:id", IsLogged , oneBook);
router.put("/books/:id",[IsLogged ,editBooksValid],  editBook);
router.delete("/books/:id",IsLogged , delBook);

module.exports = router;

