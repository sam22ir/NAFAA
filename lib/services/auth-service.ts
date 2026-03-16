import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";
import { supabase } from "../supabase";

const googleProvider = new GoogleAuthProvider();

export const AuthService = {
  // 1. Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Sync with Supabase profiles using INSERT (ignores if already exists)
      await syncUserWithSupabase(user);
      
      return user;
    } catch (error) {
      console.error("Google Sign In Error:", error);
      throw error;
    }
  },

  // 2. Logout
  logout: async () => {
    await signOut(auth);
  },

  // 3. Sign Up with Email and Password
  signUpWithEmail: async (email: string, password: string, fullName: string, phone: string, wilaya: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Sync with Supabase profiles using INSERT
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.uid,
          full_name: fullName,
          email: user.email,
          phone: phone,
          wilaya: wilaya,
          updated_at: new Date().toISOString(),
        });

      if (error && error.code !== '23505') { // Ignore unique_violation
        console.error("Error syncing profile with Supabase:", error.message);
      }
      
      return user;
    } catch (error) {
      console.error("Email Sign Up Error:", error);
      throw error;
    }
  },

  // 4. Sign In with Email
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Email Sign In Error:", error);
      throw error;
    }
  },
};

// Helper: Sync Firebase user to Supabase 'profiles' table via INSERT
async function syncUserWithSupabase(user: any) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.uid,
      full_name: user.displayName,
      email: user.email,
      updated_at: new Date().toISOString(),
    });

  if (error && error.code !== '23505') { // Ignore unique violation if user exists
    console.error("Error syncing user with Supabase:", error.message);
  }
  return data;
}
