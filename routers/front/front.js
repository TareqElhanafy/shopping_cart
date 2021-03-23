const express = require('express');
const Page = require('../../models/page');
const Product = require('../../models/product')
const mongoose = require('mongoose')
const router = new express.Router()
/**
 * 
 * Front Page
 */
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({})
        res.render('index', {
            title: "Purchase",
            products: products
        });
    } catch (error) {
        res.send('opps Sorry!')
    }
});

/**
 * 
 * Navbar Pages
 */
router.get('/pages/:slug', async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('back')
    }
})

/**
 * 
 * Category's Products
 */
router.get('/:title/products/:id', async (req, res) => {
    try {
        const products = await Product.find({ category_id: req.params.id })
        res.render('categoryProducts', {
            title: req.params.title,
            products: products
        })

    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('back')
    }
})

/**
 * 
 * Product view
 */
router.get('/product/:id/view/:slug', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            req.session.flash = {
                type: 'danger',
                message: "This product doesn't exist"
            }
            return res.redirect('back')
        }
        res.render('product_page', {
            title: product.name,
            product: product
        })
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('back')
    }

})

module.exports = router