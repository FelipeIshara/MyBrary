const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// /author, é possivel pesquisar os authores ja criados,
router.get('/', async (req,res) =>{
    let searchOptions = {}
        if (req.query.name != null && req.query.name != ''){
            searchOptions.name = new RegExp(req.query.name, 'i')
        }    
    try {
        const authors = await Author.find(searchOptions)
        res.render('../views/authors/index.ejs', {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }    
})
// pagina de criar authores novos
router.get('/new', (req,res)=>{
    res.render('authors/new.ejs', {author: new Author()})
})
// rota que lida com o armazenamento dos dados do form que tem em /new(new.ejs)
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