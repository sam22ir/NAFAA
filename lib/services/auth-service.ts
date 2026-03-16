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
      
      // Sync with Supabase profiles
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
};

// Helper: Sync Firebase user to Supabase 'profiles' table
async function syncUserWithSupabase(user: any) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.uid,
      full_name: user.displayName,
      email: user.email,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error("Error syncing user with Supabase:", error);
  }
  return data;
}
