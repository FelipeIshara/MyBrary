const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']



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
router.post('/', async (req,res)=>{
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        author: req.body.author
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        // res.redirect('books/${newBook.id}')
        res.redirect('books')
    } catch {
        renderNewPage(res, book, true)
    }
})

router.get('/:id', async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', {book: book})
    } catch {
        res.redirect('/')
    }
})


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

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params =  {
            authors: authors,
            book: book
        }
        // caso tiver ira ativar o errorMessage do partials, 
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('/books')
    }
  
}

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover !== null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}


module.exports = router;