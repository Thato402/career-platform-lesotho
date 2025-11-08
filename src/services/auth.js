import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './realtimeDb';

export const registerUser = async (email, password, userData) => {
  try {
    console.log('Starting registration process...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created:', user.uid);

    // Update profile with display name
    await updateProfile(user, {
      displayName: userData.name
    });

    // Create user profile in Realtime Database
    await createUserProfile(user.uid, {
      email: user.email,
      name: userData.name,
      role: userData.role,
      institution: userData.institution || '',
      emailVerified: false
    });

    // Send email verification
    await sendEmailVerification(user);
    console.log('Email verification sent');

    return { user, error: null };
  } catch (error) {
    console.error('Error registering user:', error);
    let errorMessage = 'Failed to create account. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please use a different email or login.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check your email.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Login successful:', user.uid);
    
    // Get user profile from Realtime Database
    const userProfile = await getUserProfile(user.uid);
    console.log('User profile:', userProfile);
    
    return { user: { ...user, profile: userProfile }, error: null };
  } catch (error) {
    console.error('Error logging in:', error);
    let errorMessage = 'Failed to log in. Please check your credentials.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please register first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check your email.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }
    
    return { user: null, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Error logging out:', error);
    return { error: error.message };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Mock authentication fallback
export const mockLogin = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        const mockUser = {
          uid: 'mock-user-id-' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          profile: {
            role: 'student',
            name: email.split('@')[0],
            institution: 'Demo University'
          }
        };
        resolve({ user: mockUser, error: null });
      } else {
        resolve({ user: null, error: 'Please enter email and password' });
      }
    }, 1000);
  });
};

// Add the missing mockRegister function
export const mockRegister = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser = {
        uid: 'mock-user-id-' + Date.now(),
        email: userData.email,
        displayName: userData.name,
        profile: userData
      };
      resolve({ user: mockUser, error: null });
    }, 1000);
  });
};