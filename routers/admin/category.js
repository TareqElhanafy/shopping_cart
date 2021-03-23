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
    try {
        const categories = await Category.find({})
        res.render('admin/category/index', {
            title: 'Categories',
            categories: categories
        })
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/')
    }
})

/**
 * 
 * get store New Category
 */
router.get('/add-category', async (req, res) => {
    try {
        res.render('admin/category/new', {
            title: 'Add Category'
        })
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/categories')
    }
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

            //setting the sidebar categories being dynamic
            Category.find({}).exec(function (error, categories) {
                if (error) {
                    console.log(error);
                }
                req.app.locals.categories = categories
            })

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
        console.log(error);
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/categories')
    }
})

/**
 * 
 * Edit Category
 */
router.get('/edit/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) {
            req.session.flash = {
                type: 'danger',
                message: 'This category not exist'
            }
            res.redirect('/admin/categories')
        } else {
            res.render('admin/category/edit', {
                title: 'Edit Category',
                category: category
            })
        }
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/categories')
    }
})

/**
 * 
 * update Category
 */
router.post('/update/:id', [
    check('title', 'title is required').notEmpty(),
    check('slug', 'slug is required').notEmpty()
], async (req, res) => {
    try {
        var result = validationResult(req)
        if (!result.isEmpty()) {
            req.session.form = {
                validations: result.errors
            }
            return res.redirect('/admin/categories/edit/' + req.params.id)
        }

        const category = await Category.findById(req.params.id)
        if (!category) {
            req.session.flash = {
                type: 'danger',
                message: 'This category not exist'
            }
            return res.redirect('/admin/categories')
        }

        const title = req.body.title
        const slug = slugify(req.body.slug, {
            lower: true
        })
        category.title = title
        category.slug = slug
        await category.save()

        //setting the sidebar categories being dynamic
        Category.find({}).exec(function (error, categories) {
            if (error) {
                console.log(error);
            }
            req.app.locals.categories = categories
        })
        req.session.flash = {
            type: 'success',
            message: 'Category updated successfully'
        }
        res.redirect('/admin/categories')
    } catch (error) {
        console.log(error);
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/categories')
    }

})

router.get('/delete/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) {
            req.session.flash = {
                type: 'danger',
                message: 'This category not exist'
            }
            return res.redirect('/admin/categories')
        }
        await category.delete()

        //setting the sidebar categories being dynamic
        Category.find({}).exec(function (error, categories) {
            if (error) {
                console.log(error);
            }
            req.app.locals.categories = categories
        })
        req.session.flash = {
            type: 'success',
            message: 'Category deleted successfully'
        }
        res.redirect('/admin/categories')
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/categories')
    }
})
module.exports = router