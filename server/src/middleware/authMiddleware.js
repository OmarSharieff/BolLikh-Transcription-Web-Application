import supabase from '../config/supabase.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authorization token is required');
    }

    console.log('Received Token:', token); // Log the token

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error('Invalid or expired token');
    }

    console.log('Authenticated User:', data.user); // Log user info

    req.user = data.user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ success: false, error: error.message });
  }
};

export default authMiddleware;