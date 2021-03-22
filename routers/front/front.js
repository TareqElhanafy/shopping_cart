const express = require('express');
const Page = require('../../models/page');
const router = new express.Router()

router.get('/', async (req, res) => {
    res.render('index', {
        title: "Purchase"
    });
});

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


module.exports = router