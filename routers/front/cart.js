const express = require('express')
const Product = require('../../models/product')
const router = new express.Router()

router.get('/', async (req, res) => {
    console.log(req.session.cart);
    res.render('cart', {
        title: 'cart',
    })
})

router.get('/:id/add/:slug', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            req.session.flash = {
                type: 'danger',
                message: "This Product doesn't exist"
            }
            return res.redirect('back')
        }
        if (typeof req.session.cart == 'undefined') {
            req.session.cart = []
            req.session.cart.push({
                id: req.params.id,
                title: req.params.slug,
                price: product.price,
                qty: 1,
                image: product.image,
            })
        } else {
            var cart = req.session.cart
            var newItem = true
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title === req.params.slug) {
                    cart[i].qty++
                    newItem = false
                    break
                }
            }
            if (newItem) {
                cart.push({
                    id:req.params.id,
                    title: req.params.slug,
                    price: product.price,
                    qty: 1,
                    image: product.image,
                })
            }
        }
        req.session.flash = {
            type: 'success',
            message: 'Product added successfully to your cart'
        }
        res.redirect('back')

    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'Something went wrong please try again later'
        }
        res.redirect('back')
    }
})


router.get('/update/:cartTitle', async (req, res) => {
    try {
        var cart = req.session.cart
        var action = req.query.action
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].title === req.params.cartTitle) {
                switch (action) {
                    case "add":
                        cart[i].qty++
                        break;
                    case "remove":
                        cart[i].qty--
                        if (cart[i].qty == 0) {
                            delete req.session.cart
                        }
                        break;
                    case "clear":
                        cart.splice(i, 1)
                        if (cart.length == 0) {
                            delete req.session.cart
                        }
                        break;
                    default:
                        console.log('problem in cart update');
                        break;
                }
            }

        }
        if (cart.length == 0) {
            req.session.flash = {
                type: 'success',
                message: "item cleared successfully"
            }
        } else {
            req.session.flash = {
                type: 'success',
                message: "item updated successfully"
            }
        }
        res.redirect('back')
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'Something went wrong please try again later'
        }
        res.redirect('back')
    }
})

router.get('/clear', async (req, res) => {
    delete req.session.cart
    req.session.flash = {
        type: 'success',
        message: "Cart cleared successfully"
    }
    res.redirect('back')
})
module.exports = router