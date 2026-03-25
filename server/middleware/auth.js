const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        console.log(`Auth success for user: ${req.user.username}`);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
