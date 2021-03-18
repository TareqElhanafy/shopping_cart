const express = require('express')
const { check, validationResult } = require('express-validator')
const router = new express.Router()
const Product = require('../../models/product')
const slugify = require('slugify')
const Category = require('../../models/category')
const mkdirp = require('mkdirp')

/**
 * Get all products
*/
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}).populate('category_id')
        console.log(products);
        res.render('admin/product/index', {
            title: 'Products',
            products: products
        })
    } catch (error) {
        console.log(error);
        req.session.flash = {
            type: 'danger',
            message: 'Something went wrong plrase try again later'
        }

        res.redirect('/admin/')
    }

})

/**
 * 
 * Get add Product
 */
router.get('/add-product', async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('admin/product/create', {
            title: 'Add Product',
            categories: categories
        })
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'Something went wrong plrase try again later'
        }
        res.redirect('/admin/products')
    }
})

/**
 * 
 * Store new product
 */
router.post('/store-product', [
    check('name', 'name is required').notEmpty(),
    check('slug', 'slug is required').notEmpty(),
    check('category_id', 'category is required').notEmpty(),
    check('price', 'price is required').notEmpty().isDecimal().withMessage('invaild value for price'),
    check('image').custom((value, { req }) => {
        if (!req.files) {
            throw new Error('image is required')
        } else {
            return true
        }
    })
], async (req, res) => {
    try {
        const result = validationResult(req)
        const categories = await Category.find({})
        if (!result.isEmpty()) {
            return res.render('admin/product/create', {
                title: 'Products',
                errors: result.errors,
                categories: categories
            })
        }
        const name = req.body.name
        const category_id = req.body.category_id
        const slug = slugify(req.body.slug, {
            lower: true
        })
        const price = req.body.price
        const imageName = req.files.image.name
        const image = req.files.image
        const checkProduct = await Product.findOne({ slug: slug })
        if (!checkProduct) {
            const product = new Product({
                name: name,
                category_id: category_id,
                slug: slug,
                price: price,
                category_id: category_id,
                image: imageName
            })
            await product.save()
            mkdirp('public/images/products')
            const path = 'public/images/products/' + imageName
            image.mv(path, function (error) {
                console.log(error)
            })
            req.session.flash = {
                type: 'success',
                message: "Product Added Successfully"
            }
            res.redirect('/admin/products')
        } else {
            req.session.flash = {
                type: 'danger',
                message: 'This product exist already !'
            }
            return res.redirect('/admin/products/product-page')
        }


    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'Something went wrong please try again later'
        }
        res.redirect('/admin/products')
    }
})

/**
 * 
 * Edit product 
 */
router.get('/edit/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
    if (!product) {
        return req.session.flash = {
            type: 'danger',
            message: 'This product not exists!'
        }
    }
    const categories = await Category.find({})
    res.render('admin/product/edit', {
        title: 'Edit Product',
        product: product,
        categories: categories
    })
})




module.exports = router