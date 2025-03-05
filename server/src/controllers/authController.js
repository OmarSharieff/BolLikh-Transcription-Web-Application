import { registerUser, loginUser, getUser } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    const user = await registerUser(email, password, fullName);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await getUser(userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};