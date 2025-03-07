import supabase from '../config/supabase.js';

/**
 * Register a new user and create a profile in the `profiles` table.
 */
export const registerUser = async (email, password, fullName) => {
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw new Error(error.message);

    if (data.user) {
      // Ensure a profile is created
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id, // Must match auth.users.id
            email: data.user.email,
            full_name: fullName,
          },
        ]);

      if (profileError) throw new Error(profileError.message);
    }

    return data.user;
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw new Error('Failed to register user: ' + error.message);
  }
};

/**
 * Login an existing user.
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return data.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw new Error('Failed to log in: ' + error.message);
  }
};

/**
 * Get the currently authenticated user.
 */
export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data.user;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    throw new Error('Failed to fetch user: ' + error.message);
  }
};

/**
 * Logout the current user.
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('Error logging out:', error.message);
    throw new Error('Failed to log out: ' + error.message);
  }
};

/**
 * Send a password reset email to the user.
 */
export const resetPasswordRequest = async (email, redirectUrl) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) throw new Error(error.message);
    
    return { message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending reset password email:', error.message);
    throw new Error('Failed to send reset password email: ' + error.message);
  }
};

/**
 * Update the user's password.
 */
export const updatePassword = async (password) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    
    if (error) throw new Error(error.message);
    
    return { message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error updating password:', error.message);
    throw new Error('Failed to update password: ' + error.message);
  }
};