const auth = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/users/login')
    } else {
        next()
    }
}

const isAdminAuth = async (req, res, next) => {
    if (!req.isAuthenticated() || req.user.admin === 0) {
        res.redirect('back')
    } else {
        next()
    }
}
module.exports = {
    auth,
    isAdminAuth,
}