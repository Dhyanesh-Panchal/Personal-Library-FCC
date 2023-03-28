/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { Book } = require('../models/Book')

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let myBooks = await Book.find({});
      console.log(myBooks);
      myBooks = myBooks.map((book) => {
        book.commentcount = book.comments.length;
        return { ...book._doc, commentcount: book.comments.length };
      })

      console.log('\n\n', myBooks)
      res.json(myBooks)
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send('missing required field title');
        return;
      }

      // CREATE BOOK
      let newBook = await Book.create({ title: title, comments: [] });
      newBook.save()
      // console.log('New Book issued:');
      // console.log(newBook);

      res.json(newBook);
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany({});
      res.send('complete delete successful')
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      let myBooks = await Book.find({ _id: bookid });
      console.log(myBooks);
      if (myBooks.length == 0) {
        res.send('no book exists');
        return;
      }

      myBooks = { ...myBooks[ 0 ]._doc, commentcount: myBooks[ 0 ].comments.length };
      // myBooks = myBooks.map((book) => {
      //   book.commentcount = book.comments.length;
      //   return { ...book._doc, commentcount: book.comments.length };
      // })

      console.log('\n\n', myBooks)
      res.json(myBooks)
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      //json res format same as .get

      let myBooks = await Book.find({ _id: bookid });
      if (myBooks.length == 0) {
        res.send('no book exists');
        return;
      }

      myBooks[ 0 ].comments.push(comment);
      myBooks[ 0 ].save();

      res.json({ ...myBooks[ 0 ]._doc, commentcount: myBooks[ 0 ].comments.length })
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let myBooks = await Book.find({ _id: bookid });
      if (myBooks.length == 0) {
        res.send('no book exists');
        return;
      }

      await Book.findByIdAndRemove(bookid);
      res.send('delete successful');
    });

};
