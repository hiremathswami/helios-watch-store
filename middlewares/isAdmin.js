// middlewares/isAdmin.js
module.exports = (req, res, next) => {
  // If not logged in
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // If logged in but not admin
  if (req.session.user.role !== 'admin') {
    return res.status(403).render('error403', {
      message: 'Access Denied – Admins Only 🚫',
    });
  }

  // Allow admin to continue
  next();
};
