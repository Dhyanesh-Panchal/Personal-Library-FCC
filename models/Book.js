const mongoose = require('mongoose');


const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: [ String ] }
})

const BookModel = new mongoose.model('Book', BookSchema);

let Book = {
    Book: BookModel
}

module.exports = Book;