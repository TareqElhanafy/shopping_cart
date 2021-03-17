const express = require('express')
const { check, validationResult } = require('express-validator')
const slugify = require('slugify')
const Category = require('../../models/category')
const router = new express.Router()

/**
 * 
 * get all categories
 */
router.get('/', async (req, res) => {
    const categories = await  Category.find({})
    res.render('admin/category/index', {
        title: 'Categories',
        categories: categories
    })
})

/**
 * 
 * Store New Category
 */
router.get('/add-category', async (req, res) => {
    res.render('admin/category/new', {
        title: 'Add Category'
    })
})

/**
 * 
 * store new category 
 */
router.post('/store-category', [
    check('title', 'title is required').notEmpty(),
    check('slug', 'slug is required').notEmpty()
], async (req, res) => {
    try {
        var result = validationResult(req)
        if (!result.isEmpty()) {
            res.render('admin/category/new', {
                title: 'categories',
                errors: result.errors,
            })
        }
        const title = req.body.title
        const slug = slugify(req.body.slug, {
            lower: true
        })
        const checkCategory = await Category.findOne({ slug: slug })
        if (!checkCategory) {
            const category = new Category({
                title: title,
                slug: slug,
            })
            await category.save()
            req.session.flash = {
                type: 'success',
                message: 'New category added successfully'
            }
            res.redirect('/admin/categories/')
        } else {
            req.session.flash = {
                type: 'danger',
                message: 'This category already exists!'
            }
            res.redirect('/admin/categories')
        }
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/categories')
    }
})





module.exports = router