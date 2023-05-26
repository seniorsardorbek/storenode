const { User, Book, Author } = require('../models/Models')
const Io = require('../utils/Io')
const { isAdmin } = require('../utils/utils')
const Authors = new Io('./db/authors.json')
const Books = new Io('./db/books.json')
const uuid = require('uuid')
const { AuthorModel } = require('../models/Models')

exports.postAuthor = async (req, res) => {
  try {
    const authtoken = req.headers.auth
    const myrole = await isAdmin(authtoken, 'admin')
    if (!myrole) {
      return res.status(409).send({ message: 'Forbidden!' })
    }
    const authors = await Authors.read()
    const { id, name } = req.body
    const finded = authors.find(a => a.name === name)
    if (finded) {
      return res.status(409).send({ message: 'Shoir already exist!' })
    }
    const current = new AuthorModel(id, name)
    Authors.write([...authors, current])
    res.status(200).send({ message: 'Succcesfully added' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAuthor = async (req, res) => {
  try {
    const authors = await Authors.read()
    res.status(200).send({ message: 'Succcesfully ', authors })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getOneAuthor = async (req, res) => {
  try {
    const id = req.params.id
    const books = await Books.read()
    const authors = await Authors.read()
    const finded = authors.find(a => a.id === id)
    const filtered = books.filter(a => a.authorId === id)
    if (!finded) {
      return res.status(404).json({ message: 'Book is not found' })
    }
    finded.countBook = filtered?.length
    res.status(200).send({ message: 'Succcesfully ', finded })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.EditAuthor = async (req, res) => {
  try {
    const authorId = req.params.id
    const authors = await Authors.read()
    const finded = authors.find(a => a.id === authorId)
    const { id, name } = req.body
    id && (finded.id = id)
    name && (finded.name = name)
    Authors.write(authors)
    res.status(200).send({ message: 'Succcesfully ' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.delAuthor = async (req, res) => {
  try {
    const id = req.params.id
    const authors = await Authors.read()
    const finded = authors.find(a => a.id === id)
    if (!finded) {
      return res.status(404).send({ message: 'Author  not found ' })
    }
    const filtered = authors.filter(a => a.id !== id)
    Authors.write(filtered)
    res.status(200).send({ message: 'Succcesfully deleted ' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
