import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

export type AccountType = 'individual' | 'fleet' | 'enterprise';

interface User {
  id: string;
  email: string;
  fullName: string;
  accountType: AccountType;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, accountType: AccountType) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Optimistically set user with info from Auth object
        const basicUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || 'User',
          accountType: 'individual',
        };

        // If we already have a user in state (from signup/google login), don't overwrite with 'User'
        setUser(prev => {
          if (prev && prev.id === firebaseUser.uid) {
            return {
              ...prev,
              fullName: firebaseUser.displayName || prev.fullName,
            };
          }
          return basicUser;
        });

        // Try to fetch metadata from Firestore
        getDoc(doc(db, 'users', firebaseUser.uid))
          .then((userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                fullName: userData.fullName || firebaseUser.displayName || 'User',
                accountType: (userData.accountType as AccountType) || 'individual',
                avatar: userData.avatar,
              });
            }
          })
          .catch(err => {
            console.warn("AuthContext: Firestore fetch error (expected if offline/waiting):", err);
          });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    accountType: AccountType
  ) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

    // Set displayName immediately in Auth so it's available even if Firestore fails
    await updateProfile(firebaseUser, { displayName: fullName });

    // Update local state immediately for the UI
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      fullName,
      accountType,
    };
    setUser(newUser);

    // Store in Firestore. Fire and forget to avoid hanging
    const userData = {
      fullName,
      accountType,
      email,
      createdAt: new Date().toISOString(),
    };

    setDoc(doc(db, 'users', firebaseUser.uid), userData).catch(err => {
      console.error("AuthContext: Metadata storage failed (offline?):", err);
    });
  };

  const loginWithGoogle = async () => {
    try {
      console.log("AuthContext: Starting Google Sign-In popup...");
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      console.log("AuthContext: Google Auth success for:", firebaseUser.email);

      // Optimistically set the user state immediately
      const basicUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        fullName: firebaseUser.displayName || 'Google User',
        accountType: 'individual',
        avatar: firebaseUser.photoURL || undefined,
      };
      setUser(basicUser);

      // Attempt to sync with Firestore, but don't let it block the login if it fails
      try {
        console.log("AuthContext: Checking Firestore for user metadata...");
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
          console.log("AuthContext: Creating new Firestore document for Google user");
          const userData = {
            fullName: firebaseUser.displayName || 'Google User',
            accountType: 'individual' as AccountType,
            email: firebaseUser.email || '',
            createdAt: new Date().toISOString(),
            avatar: firebaseUser.photoURL,
          };

          await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        } else {
          console.log("AuthContext: Existing Firestore document found");
          const userData = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            fullName: userData.fullName || firebaseUser.displayName || 'User',
            accountType: (userData.accountType as AccountType) || 'individual',
            avatar: userData.avatar || firebaseUser.photoURL || undefined,
          });
        }
      } catch (firestoreError) {
        console.warn("AuthContext: Firestore sync failed (ignoring to allow login):", firestoreError);
        // We already set basicUser, so the user can still proceed
      }
    } catch (error: any) {
      console.error("AuthContext: loginWithGoogle critical failure:", error);
      throw error; // Re-throw so the UI can handle it
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
