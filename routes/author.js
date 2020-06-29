const express = require('express')
const router = express.Router()
const Author = require('../models/author')

router.get('/', async (req,res) =>{
    try{
        const authors = await Author.find({})
        res.render('../views/authors/index.ejs', {authors: authors})
    } catch {
        res.redirect('/')
    }    
})

router.get('/new', (req,res)=>{
    res.render('authors/new.ejs', {author: new Author()})
})

router.post('/', async (req,res)=>{
    const author = new Author({
        name: req.body.name 
    })
    try {
        const newAuthor = await author.save()
        // res.redirect('authors/${newAuthor.id}')
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
    
    /*author.save((err, newAuthor) => {
        if (err) {
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error creating Author'
            })
        } else {
            // res.redirect('authors/${newAuthor.id}')
            res.redirect('authors')
        }
    })*/
})

module.exports = router;