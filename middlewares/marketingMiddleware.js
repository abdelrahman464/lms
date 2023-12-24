

exports.validateMarketerAuthority = (req, res, next) => {
    if (req.user._id == req.params.marketerId || req.user.role === 'admin') {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
};

