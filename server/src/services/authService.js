import supabase from '../config/supabase.js';

/**
 * Register a new user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} fullName - The user's full name.
 * @returns {Promise<Object>} - The registered user object.
 */
export const registerUser = async (email, password, fullName) => {
  try {
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Create a profile for the user in the `profiles` table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id, // Link to auth.users.id
          email: data.user.email,
          full_name: fullName,
        },
      ]);

    if (profileError) {
      throw new Error(profileError.message);
    }

    return data.user;
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw new Error('Failed to register user: ' + error.message);
  }
};

/**
 * Log in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - The logged-in user object.
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw new Error('Failed to log in: ' + error.message);
  }
};

/**
 * Fetch user details from the `profiles` table.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object>} - The user's profile data.
 */
export const getUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    throw new Error('Failed to fetch user: ' + error.message);
  }
};