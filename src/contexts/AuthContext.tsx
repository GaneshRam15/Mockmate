
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Admin email - check against Firestore custom claims or a predefined list
const ADMIN_EMAILS = ['admin@mockmate.com'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          isAdmin: ADMIN_EMAILS.includes(firebaseUser.email || '') || userData?.isAdmin || false,
          name: firebaseUser.displayName || userData?.name || firebaseUser.email?.split('@')[0] || 'User',
        };
        
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();
      
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        isAdmin: ADMIN_EMAILS.includes(firebaseUser.email || '') || userData?.isAdmin || false,
        name: firebaseUser.displayName || userData?.name || firebaseUser.email?.split('@')[0] || 'User',
      };
      
      toast({
        title: appUser.isAdmin ? "Welcome, Admin!" : "Welcome!",
        description: appUser.isAdmin 
          ? "You have successfully logged in as an administrator."
          : "You have successfully logged in.",
      });
      
      return appUser;
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }
  };

  const signup = async (credentials: LoginCredentials): Promise<User> => {
    try {
      // Check if trying to sign up with admin email
      if (ADMIN_EMAILS.includes(credentials.email)) {
        throw new Error('This email is reserved for admin access.');
      }
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Set display name
      const displayName = credentials.email.split('@')[0];
      await updateProfile(firebaseUser, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: credentials.email,
        name: displayName,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      });
      
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        isAdmin: false,
        name: displayName,
      };
      
      toast({
        title: "Account created!",
        description: "You have successfully signed up and logged in.",
      });
      
      return appUser;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please try a different email or login.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state while checking auth status
  if (loading) {
    return null; // Or a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
      login, 
      signup,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
