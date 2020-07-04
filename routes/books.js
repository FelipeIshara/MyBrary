const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const uploadPath = path.join('public', Book.coverImageBasePath)
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


//ALL BOOKS ROUTE
router.get('/', async (req,res) =>{
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    } 
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    } 
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    } 
    try{
    const books = await query.exec()
    res.render('books/index', {
        books: books,
        searchOptions: req.query
    })
} catch {
        console.log("ops")
        res.redirect('/')
    }
})

//NEW BOOK ROUTE
router.get('/new', async (req,res)=>{
    renderNewPage(res, new Book())
}) 
//Create Book Route
router.post('/', upload.single('cover'), async (req,res)=>{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        author: req.body.author
        

    })

    try {
        const newBook = await book.save()
        // res.redirect('books/${newBook.id}')
        res.redirect('books')
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params =  {
            authors: authors,
            book: book
        }
        // caso tiver ira ativar o errorMessage do partials, 
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
  
}




module.exports = router;