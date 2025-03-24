const passport = require('passport');

const authMiddleware = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
        }
        req.user = user; // Attach user to request object
        next();
    })(req, res, next);
};

module.exports = authMiddleware;
