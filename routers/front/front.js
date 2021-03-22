const express = require('express');
const Page = require('../../models/page');
const Product = require('../../models/product')
const router = new express.Router()

/**
 * 
 * Front Page
 */
router.get('/', async (req, res) => {
    //setting the frontpage products being dynamic
    const products = await Product.find({})
    res.render('index', {
        title: "Purchase",
        products: products
    });
});

/**
 * 
 * Navbar Pages
 */
router.get('/:slug', async (req, res) => {
    const page = await Page.findOne({ slug: req.params.slug })
    if (!page) {
        req.session.flash = {
            type: 'danger',
            message: "Sorry This page doesn't exist"
        }
        return res.redirect('/')
    }
    res.render('page', {
        title: page.title,
        content: page.content
    })
})

/**
 * 
 * Category's Products
 */
router.get('/:title/products/:id', async (req, res) => {
    const products = await Product.find({ category_id: req.params.id })
    res.render('categoryProducts', {
        title: req.params.title,
        products: products
    })
})

module.exports = router