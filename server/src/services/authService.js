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
