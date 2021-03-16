const express = require('express')
const slugify = require('slugify')
const { check, validationResult, body } = require('express-validator')
const Page = require('../models/page')
const router = new express.Router()

//Admin Dashboard
router.get('/', async (req, res) => {
    res.send('admin area')
})

//Page Routes

/**
 * Add page Route
 */
router.get('/add-page', async (req, res) => {
    res.render('admin/add_page', {
        title: 'Add Page',
        slug: 'slug',
        content: 'content'
    })
})

/**
 * 
 * Store Page Route
 */
router.post('/store-page', [
    check('title', 'title is required').notEmpty(),
    check('slug', 'slug is required').notEmpty(),
    check('content', 'content is required'),
], async (req, res) => {
    try {
        var result = validationResult(req)
        console.log(result.errors);
        if (!result.isEmpty()) {
            return res.render('admin/add_page', {
                'title': 'add page',
                'errors': result.errors,
                'alert_type': 'danger'
            })
        }

        const title = req.body.title
        const slug = slugify(req.body.slug, {
            lower: true
        })
        const content = req.body.content
        console.log(req.body);
        const storedSlug = await Page.findOne({ slug: slug })
        if (!storedSlug) {
            const newSlug = new Page({
                title: title,
                slug: slug,
                content: content,
                sorting: Math.floor(Math.random() * 100) + 1
            })
            await newSlug.save()
            console.log('newSlug done');
            req.session.flash = {
                type: 'success',
                message: 'New Page successfully added'
            }
            return res.redirect('/admin/add-page')
        }
        req.session.flash = {
            type: 'danger',
            message: 'This page exist already !'
        }
        return res.redirect('/admin/add-page')
    } catch (error) {
        console.log(error);
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/add-page')
    }

})

router.get('/pages', async (req, res) => {
    const pages = await Page.find({}).sort({sorting:"asc"})
    res.render('admin/pages', {
        title: 'Pages',
        pages: pages
    })
})












module.exports = router