const express = require('express')
const { check, validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../../models/user')
const router = new express.Router()

router.get('/register', async (req, res) => {
    res.render('register', {
        title: 'register'
    })
})
router.get('/login', async (req, res) => {
    res.render('login', {
        title: 'login'
    })
})
router.post('/register', [
    check('name', 'name is required').notEmpty().isString().withMessage('passowrd must be valid'),
    check('email', 'email is required').notEmpty().isEmail().withMessage('email must be vaild'),
    check('password', 'password is required').notEmpty().isString().withMessage('passowrd must be valid'),
    check('confirm_password', 'password confirmation is required').notEmpty().custom((value, { req }) => {
        if (req.body.password !== req.body.confirm_password) {
            throw new Error('password not matching')
        } else {
            return true
        }
    })
], async (req, res) => {
    try {
        var result = validationResult(req)
        if (!result.isEmpty()) {
            req.session.form = {
                validations: result.errors
            }
            return res.redirect('back')
        }
        const CheckUser = await User.findOne({ email: req.body.email })
        if (CheckUser) {
            req.session.flash = {
                type: 'danger',
                message: 'This email is taken'
            }
            return res.redirect('back')
        }
        var user = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10)
        })
        await user.save()
        req.session.flash = {
            type: 'success',
            message: 'Successfully Registered'
        }
        res.redirect('/')
    } catch (error) {
        req.session.flash = {
            type: 'danger',
            message: 'something went wrong please try again later'
        }
        res.redirect('back')
    }

})

router.post('/login', [
    check('email', 'email is required').notEmpty().isEmail().withMessage('email must be valid'),
    check('password', 'password is required').notEmpty().isString().withMessage('passowrd must be valid'),],
    async (req, res, next) => {
        try {
            var result = validationResult(req)
            if (!result.isEmpty()) {
                req.session.form = {
                    validations: result.errors
                }
                return res.redirect('back')
            }
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/users/login',
                failureFlash: false
            })(req, res, next)
        } catch (error) {
            console.log(error);
            req.session.flash = {
                type: 'danger',
                message: 'something went wrong please try again later'
            }
            res.redirect('back')
        }

    })

router.get('/logout', async (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router