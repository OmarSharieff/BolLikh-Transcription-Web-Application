import { registerUser, loginUser, getUser, resetPasswordRequest, updatePassword } from '../services/authService.js';

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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email, redirectUrl } = req.body;
    const result = await resetPasswordRequest(email, redirectUrl);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const result = await updatePassword(password);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};