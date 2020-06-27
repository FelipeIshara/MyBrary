const express = require('express')
const router = express.Router()

router.get('/', (req,res) =>{
    res.render('../views/authors/index.ejs')
})

router.get('/new', (req,res)=>{
    res.render('../views/authors/new.ejs')
})

router.post('/', (req,res)=>{
    res.send("foda-se")
})

module.exports = router;