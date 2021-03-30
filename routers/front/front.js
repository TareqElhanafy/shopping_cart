const express = require('express');
const Page = require('../../models/page');
const Product = require('../../models/product')
const stripe = require('stripe')(process.env.STRIPE_SECRET);
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

router.get('/payment/stripe', async (req, res) => {
    res.render('stripe', {
        title: 'Payment'
    })
})
router.post('/create-checkout-session', async (req, res) => {
    var cart = req.session.cart
    var line_items = []
    cart.forEach(product => {
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.title,
                    images: ['https://localhost:3111/public/images/products' + product.id + product.image],
                },
                unit_amount: product.price * 100,
            },
            quantity: product.qty,
        })
    });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `http://localhost:3111/`,
        cancel_url: `http://localhost:3111/cart`,
    });
    delete req.session.cart
    res.json({ id: session.id });


})


module.exports = router