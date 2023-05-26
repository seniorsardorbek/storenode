require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json())

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const PORT = process.env.PORT

const auth = require('./routers/auth.route')
const book = require('./routers/books.route')
const author = require('./routers/authors.route')

app.use(auth);
app.use(book);
app.use(author);


app.listen(PORT , ()=>{
    console.log(PORT);
})
 