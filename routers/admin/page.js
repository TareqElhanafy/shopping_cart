const express = require('express')
const slugify = require('slugify')
const { check, validationResult, body } = require('express-validator')
const Page = require('../../models/page')
const router = new express.Router()


/**
 * All Pages Route
 */
router.get('/all', async (req, res) => {
    try {
        const pages = await Page.find({}).sort({ sorting: "asc" })
        res.render('admin/page/pages', {
            title: 'Pages',
            pages: pages
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
 * Add page Route
 */
router.get('/add-page', async (req, res) => {
    try {
        res.render('admin/page/add_page', {
            title: 'Add Page',
            slug: 'slug',
            content: 'content'
        })
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/pages/all')
    }
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
        if (!result.isEmpty()) {
            return res.render('admin/page/add_page', {
                'title': 'add page',
                'errors': result.errors,
            })
        }

        const title = req.body.title
        const slug = slugify(req.body.slug, {
            lower: true
        })
        const content = req.body.content

        const storedSlug = await Page.findOne({ slug: slug })
        if (!storedSlug) {
            const newSlug = new Page({
                title: title,
                slug: slug,
                content: content,
                sorting: Math.floor(Math.random() * 100) + 1
            })

            await newSlug.save()

            req.session.flash = {
                type: 'success',
                message: 'New Page successfully added'
            }
            return res.redirect('/admin/pages/all')
        }
        req.session.flash = {
            type: 'danger',
            message: 'This page exist already !'
        }
        return res.redirect('/admin/pages/add-page')
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/pages/add-page')
    }

})


/**
 * 
 * Edit Page Route
 */
router.get("/edit/:slug", async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug })
        if (!page) {
            req.session.flash = {
                type: 'danger',
                message: 'This page not existing'
            }
            res.redirect('/admin/pages/all')
        } else {
            res.render('admin/page/edit_page', {
                title: 'Edit Page',
                page: page
            })
        }
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/pages/all')
    }

})

/**
 * 
 * Update Page Route
 */
router.post('/update-page/:slug', [
    check('title', 'title is required').notEmpty(),
    check('slug', 'slug is required').notEmpty(),
    check('content', 'content is required'),
], async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug })
        if (!page) {
            req.session.flash = {
                type: 'danger',
                message: 'This page not existing'
            }
            return res.redirect("/admin/pages/edit/" + page.slug)
        }

        var result = validationResult(req)
        if (!result.isEmpty()) {
            return res.render('admin/page/edit_page', {
                title: 'Edit Page',
                errors: result.errors
            })
        }
        page.title = req.body.title
        page.slug = slugify(req.body.slug, {
            lower: true
        })
        page.content = req.body.content
        await page.save()
        req.session.flash = {
            type: 'success',
            message: 'Page updated successfully'
        }
        res.redirect('/admin/pages/all')

    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/pages/all')
    }
})

/**
 * 
 * Delete Page Route
 */
router.get('/delete-page/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug })
        if (!page) {
            req.session.flash = {
                type: 'danger',
                message: 'This page not existing'
            }
            res.redirect("/admin/pages/all")
        } else {
            await page.delete()
            req.session.flash = {
                type: 'success',
                message: 'Page deleted successfully'
            }
            res.redirect('/admin/pages/all')
        }
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('/admin/pages/all')
    }
})












module.exports = router