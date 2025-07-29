const requireRegisterSession = (req, res, next) => {
    if (!req.session.userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
    next();
  };
  
  module.exports = requireRegisterSession;
  