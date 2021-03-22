const express = require('express')
const { check, validationResult } = require('express-validator')
const router = new express.Router()
const Product = require('../../models/product')
const slugify = require('slugify')
const Category = require('../../models/category')
const mkdirp = require('mkdirp')
const fs = require('fs')
/**
 * Get all products
*/
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}).populate('category_id')
        res.render('admin/product/index', {
            title: 'Products',
            products: products
        })
    } catch (error) {
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
        } else if (['image/png', 'image/jpeg'].indexOf(req.files.image.mimetype) === -1) {
            throw new Error('only images with types jpeg, png are allowed')
        } else {
            return true
        }
    })
], async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const categories = await Category.find({})
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
            var dir = 'public/images/products/'
            mkdirp(dir)
            const path = dir + product._id + imageName
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
            return res.redirect('/admin/products')
        }


    } catch (error) {
        console.log(error);
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
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            req.session.flash = {
                type: 'danger',
                message: 'This product not exists!'
            }
            return res.redirect('/admin/products')

        }
        const categories = await Category.find({})
        res.render('admin/product/edit', {
            title: 'Edit Product',
            product: product,
            categories: categories
        })
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'Something went wrong please try again later'
        }
        res.redirect('/admin/products')
    }
})

/**
 * Update Product
 */
router.post('/update-product/:id', [
    check('name', 'name is required').notEmpty(),
    check('slug', 'slug is required').notEmpty(),
    check('category_id', 'category is required').notEmpty(),
    check('price', 'price is required').notEmpty().isDecimal().withMessage('invaild value for price'),
    check('image').custom((value, { req }) => {
        if (req.files) {
            if (['image/png', 'image/jpeg'].indexOf(req.files.image.mimetype) === -1) {
                throw new Error('only images with types jpeg, png are allowed')
            } else {
                return true
            }
        } else {
            return true
        }
    })
], async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            req.session.form = {
                validations: result.errors
            }
            return res.redirect('/admin/products/edit/' + req.params.id)
        }
        const product = await Product.findById(req.params.id)
        if (!product) {
            req.session.flash = {
                type: 'danger',
                message: 'This product does not exist!'
            }
            return res.redirect('/admin/products')
        }
        var image = ''
        var imageName = ''
        if (req.files) {
            imageName = req.files.image.name
            image = req.files.image

            var dir = 'public/images/products/'

            fs.unlink(dir + product._id + product.image, function (err) {
                console.log(err);
            })

            mkdirp(dir)

            image.mv(dir + product._id + imageName, function (error) {
                console.log(error);
            })
        } else {
            imageName = product.image
        }
        product.title = req.body.title
        product.slug = req.body.slug
        product.price = req.body.price
        product.category_id = req.body.category_id
        product.image = imageName
        await product.save()
        req.session.flash = {
            type: 'success',
            message: "Product updated Successfully"
        }
        res.redirect('/admin/products')

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
 * Delete Product
 */
router.get('/delete/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            req.session.flash = {
                type: 'danger',
                message: "This product doesn't exist"
            }
            return redirect('/admin/products')
        }
        fs.unlink('public/images/products/' + product._id + product.image, function (error) {
            console.log(error);
        })
        await product.delete()
        req.session.flash = {
            type: 'success',
            message: 'Product deleted successfully'
        }
        return res.redirect('/admin/products')
    } catch (error) {
        console.log(error);
        req.session.flash = {
            type: 'danger',
            message: 'Something went wrong please try again later'
        }
        res.redirect('/admin/products')
    }
})
module.exports = router