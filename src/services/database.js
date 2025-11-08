import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// User Management
export const createUserProfile = async (userId, userData) => {
  try {
    console.log('Creating user profile for:', userId);
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('User profile created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    console.log('Fetching user profile for:', userId);
    const q = query(collection(db, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      console.log('User profile found:', userData);
      return userData;
    }
    console.log('No user profile found for:', userId);
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    // For demo purposes, return mock data
    return {
      id: 'mock-profile-id',
      name: 'Demo User',
      role: 'student',
      institution: 'Demo University',
      email: 'demo@careerpath.ls'
    };
  }
};

// Institution Management
export const getInstitutions = async () => {
  try {
    const q = query(collection(db, 'institutions'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const institutions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If no institutions found, return mock data
    if (institutions.length === 0) {
      return getMockInstitutions();
    }
    
    return institutions;
  } catch (error) {
    console.error('Error getting institutions:', error);
    // Return mock data for demo
    return getMockInstitutions();
  }
};

// Mock data for demo
const getMockInstitutions = () => {
  return [
    {
      id: '1',
      name: 'National University of Lesotho',
      location: 'Roma, Maseru',
      description: 'The premier institution of higher learning in Lesotho offering diverse academic programs.',
      coursesCount: 45,
      studentsCount: 8000,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      name: 'Limkokwing University of Creative Technology',
      location: 'Maseru',
      description: 'A global university with focus on creativity, innovation and technology.',
      coursesCount: 32,
      studentsCount: 3500,
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      name: 'Botho University',
      location: 'Maseru',
      description: 'Committed to providing quality education with industry-relevant programs.',
      coursesCount: 28,
      studentsCount: 2800,
      image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];
};

export const createInstitution = async (institutionData) => {
  try {
    const docRef = await addDoc(collection(db, 'institutions'), {
      ...institutionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating institution:', error);
    throw error;
  }
};

// Course Management
export const getCourses = async (institutionId = null) => {
  try {
    let q;
    if (institutionId) {
      q = query(
        collection(db, 'courses'), 
        where('institutionId', '==', institutionId),
        orderBy('name')
      );
    } else {
      q = query(collection(db, 'courses'), orderBy('name'));
    }
    
    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If no courses found, return mock data
    if (courses.length === 0) {
      return getMockCourses();
    }
    
    return courses;
  } catch (error) {
    console.error('Error getting courses:', error);
    // Return mock data for demo
    return getMockCourses();
  }
};

const getMockCourses = () => {
  return [
    {
      id: '1',
      name: 'Computer Science',
      institutionId: '1',
      institutionName: 'National University of Lesotho',
      description: 'Bachelor of Science in Computer Science with focus on software development and algorithms.',
      duration: '4 years',
      fee: '25,000',
      requirements: ['Mathematics B', 'Physical Science C', 'English C']
    },
    {
      id: '2',
      name: 'Business Administration',
      institutionId: '2',
      institutionName: 'Limkokwing University',
      description: 'Bachelor of Business Administration with specializations in management and entrepreneurship.',
      duration: '3 years',
      fee: '22,000',
      requirements: ['Mathematics D', 'English C', 'Commerce C']
    },
    {
      id: '3',
      name: 'Electrical Engineering',
      institutionId: '1',
      institutionName: 'National University of Lesotho',
      description: 'Bachelor of Engineering in Electrical and Electronic systems.',
      duration: '4 years',
      fee: '28,000',
      requirements: ['Mathematics B', 'Physical Science B', 'English C']
    }
  ];
};

export { db };