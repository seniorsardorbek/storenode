const router = require('express').Router()
const {
  postAuthor,
  getAuthor,
  getOneAuthor,
  EditAuthor,
  delAuthor
} = require('../controller/author.controller')
const { authorJoi, authorEditJoi } = require('../utils/schemes')
const { regValidator, IsLogged } = require('../utils/validators')

const authorValidator = regValidator(authorJoi)
const authorEditValidator = regValidator(authorEditJoi)

router.post('/authors', IsLogged, authorValidator, postAuthor)
router.get('/authors', IsLogged, getAuthor)
router.get('/authors/:id', IsLogged, getOneAuthor)
router.put('/authors/:id', [IsLogged, authorEditValidator], EditAuthor)
router.delete('/authors/:id', IsLogged, delAuthor)

module.exports = router
