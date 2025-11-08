import { db } from './firebase';
import { ref, set, get, child, push, update, remove, query, orderByChild, equalTo } from 'firebase/database';

// User Management
export const createUserProfile = async (userId, userData) => {
  try {
    console.log('Creating user profile for:', userId);
    await set(ref(db, 'users/' + userId), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('User profile created successfully');
    return userId;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    console.log('Fetching user profile for:', userId);
    const snapshot = await get(ref(db, 'users/' + userId));
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log('User profile found:', userData);
      return userData;
    }
    console.log('No user profile found for:', userId);
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Institution Management
export const getInstitutions = async () => {
  try {
    console.log('Fetching institutions...');
    const snapshot = await get(ref(db, 'institutions'));
    if (snapshot.exists()) {
      const institutions = snapshot.val();
      // Convert object to array
      const institutionsArray = Object.keys(institutions).map(key => ({
        id: key,
        ...institutions[key]
      }));
      console.log('Institutions found:', institutionsArray.length);
      return institutionsArray;
    }
    console.log('No institutions found, returning mock data');
    return getMockInstitutions();
  } catch (error) {
    console.error('Error getting institutions:', error);
    return getMockInstitutions();
  }
};

export const createInstitution = async (institutionData) => {
  try {
    const newInstitutionRef = push(ref(db, 'institutions'));
    await set(newInstitutionRef, {
      ...institutionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return newInstitutionRef.key;
  } catch (error) {
    console.error('Error creating institution:', error);
    throw error;
  }
};

// Course Management
export const getCourses = async (institutionId = null) => {
  try {
    console.log('Fetching courses...');
    const snapshot = await get(ref(db, 'courses'));
    if (snapshot.exists()) {
      const courses = snapshot.val();
      // Convert object to array
      let coursesArray = Object.keys(courses).map(key => ({
        id: key,
        ...courses[key]
      }));
      
      // Filter by institution if specified
      if (institutionId) {
        coursesArray = coursesArray.filter(course => course.institutionId === institutionId);
      }
      
      console.log('Courses found:', coursesArray.length);
      return coursesArray;
    }
    console.log('No courses found, returning mock data');
    return getMockCourses();
  } catch (error) {
    console.error('Error getting courses:', error);
    return getMockCourses();
  }
};

export const createCourse = async (courseData) => {
  try {
    const newCourseRef = push(ref(db, 'courses'));
    await set(newCourseRef, {
      ...courseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return newCourseRef.key;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Application Management
export const createApplication = async (applicationData) => {
  try {
    // Check if student already has applications for this institution
    const applicationsSnapshot = await get(ref(db, 'applications'));
    let existingApps = [];
    
    if (applicationsSnapshot.exists()) {
      const allApplications = applicationsSnapshot.val();
      existingApps = Object.values(allApplications).filter(app => 
        app.studentId === applicationData.studentId && 
        app.institutionId === applicationData.institutionId
      );
    }
    
    if (existingApps.length >= 2) {
      throw new Error('Maximum 2 applications per institution allowed');
    }

    const newApplicationRef = push(ref(db, 'applications'));
    await set(newApplicationRef, {
      ...applicationData,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    return newApplicationRef.key;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

// Application Management
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    await update(ref(db, 'applications/' + applicationId), {
      status: status,
      processedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return applicationId;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export const deleteApplication = async (applicationId) => {
  try {
    await remove(ref(db, 'applications/' + applicationId));
    return applicationId;
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};

// Job Management
export const getJobs = async () => {
  try {
    const snapshot = await get(ref(db, 'jobs'));
    if (snapshot.exists()) {
      const jobs = snapshot.val();
      return Object.keys(jobs).map(key => ({
        id: key,
        ...jobs[key]
      }));
    }
    return getMockJobs();
  } catch (error) {
    console.error('Error getting jobs:', error);
    return getMockJobs();
  }
};

export const createJob = async (jobData) => {
  try {
    const newJobRef = push(ref(db, 'jobs'));
    await set(newJobRef, {
      ...jobData,
      status: 'active',
      postedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return newJobRef.key;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const getStudentApplications = async (studentId) => {
  try {
    const snapshot = await get(ref(db, 'applications'));
    if (snapshot.exists()) {
      const applications = snapshot.val();
      const applicationsArray = Object.keys(applications).map(key => ({
        id: key,
        ...applications[key]
      }));
      
      // Filter by student ID and sort by applied date
      return applicationsArray
        .filter(app => app.studentId === studentId)
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    }
    return [];
  } catch (error) {
    console.error('Error getting student applications:', error);
    return [];
  }
};

// ==================== COMPANY MANAGEMENT FUNCTIONS ====================

// Get all companies
export const getCompanies = async () => {
  try {
    console.log('Fetching companies...');
    const snapshot = await get(ref(db, 'companies'));
    if (snapshot.exists()) {
      const companies = snapshot.val();
      const companiesArray = Object.keys(companies).map(key => ({
        id: key,
        ...companies[key]
      }));
      console.log('Companies found:', companiesArray.length);
      return companiesArray;
    }
    console.log('No companies found, returning mock data');
    return getMockCompanies();
  } catch (error) {
    console.error('Error getting companies:', error);
    return getMockCompanies();
  }
};

// Get company by ID
export const getCompanyById = async (companyId) => {
  try {
    const snapshot = await get(ref(db, 'companies/' + companyId));
    if (snapshot.exists()) {
      return {
        id: companyId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting company:', error);
    throw error;
  }
};

// Create new company
export const createCompany = async (companyData) => {
  try {
    const newCompanyRef = push(ref(db, 'companies'));
    await set(newCompanyRef, {
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobCount: 0,
      isActive: true
    });
    return newCompanyRef.key;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

// Update company
export const updateCompany = async (companyId, companyData) => {
  try {
    await update(ref(db, 'companies/' + companyId), {
      ...companyData,
      updatedAt: new Date().toISOString()
    });
    return companyId;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

// Delete company
export const deleteCompany = async (companyId) => {
  try {
    await remove(ref(db, 'companies/' + companyId));
    return companyId;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

// Search companies
export const searchCompanies = async (searchTerm) => {
  try {
    const companies = await getCompanies();
    const filteredCompanies = companies.filter(company =>
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredCompanies;
  } catch (error) {
    console.error('Error searching companies:', error);
    throw error;
  }
};

// Get companies by industry
export const getCompaniesByIndustry = async (industry) => {
  try {
    const companies = await getCompanies();
    return companies.filter(company => 
      company.industry?.toLowerCase() === industry.toLowerCase()
    );
  } catch (error) {
    console.error('Error getting companies by industry:', error);
    throw error;
  }
};

// Get company jobs
export const getCompanyJobs = async (companyId) => {
  try {
    const snapshot = await get(ref(db, 'jobs'));
    if (snapshot.exists()) {
      const jobs = snapshot.val();
      const jobsArray = Object.keys(jobs).map(key => ({
        id: key,
        ...jobs[key]
      }));
      
      return jobsArray.filter(job => job.companyId === companyId);
    }
    return [];
  } catch (error) {
    console.error('Error getting company jobs:', error);
    return [];
  }
};

// Update company job count
export const updateCompanyJobCount = async (companyId) => {
  try {
    const jobs = await getCompanyJobs(companyId);
    await update(ref(db, 'companies/' + companyId), {
      jobCount: jobs.length,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating company job count:', error);
    throw error;
  }
};

// ==================== MOCK DATA ====================

const getMockCompanies = () => {
  return [
    {
      id: '1',
      name: 'Tech Solutions Lesotho',
      industry: 'Information Technology',
      location: 'Maseru, Lesotho',
      description: 'Leading technology company providing innovative solutions for businesses across Lesotho. We specialize in software development, IT consulting, and digital transformation.',
      tagline: 'Innovating for a better tomorrow',
      logo: 'https://via.placeholder.com/100x100/3498db/ffffff?text=TSL',
      website: 'https://techsolutions.ls',
      email: 'careers@techsolutions.ls',
      phone: '+266 1234 5678',
      address: '123 Tech Street, Maseru 100, Lesotho',
      size: '50-100 employees',
      founded: '2015',
      type: 'Private Limited',
      jobCount: 5,
      cultureTags: ['Innovative', 'Collaborative', 'Flexible', 'Growth-oriented'],
      benefits: [
        'Health insurance',
        'Flexible working hours',
        'Professional development',
        'Remote work options',
        'Performance bonuses'
      ],
      isActive: true
    },
    {
      id: '2',
      name: 'Lesotho Commercial Bank',
      industry: 'Banking & Finance',
      location: 'Maseru, Lesotho',
      description: 'Premier financial institution serving individuals and businesses across Lesotho with comprehensive banking solutions.',
      tagline: 'Your trusted financial partner',
      logo: 'https://via.placeholder.com/100x100/27ae60/ffffff?text=LCB',
      website: 'https://lesothobank.ls',
      email: 'hr@lcb.ls',
      phone: '+266 2231 4567',
      address: '456 Finance Avenue, Maseru 100, Lesotho',
      size: '200-500 employees',
      founded: '1980',
      type: 'Public Limited',
      jobCount: 8,
      cultureTags: ['Professional', 'Stable', 'Customer-focused', 'Traditional'],
      benefits: [
        'Pension scheme',
        'Medical aid',
        'Loan facilities',
        'Training programs',
        'Annual bonuses'
      ],
      isActive: true
    },
    {
      id: '3',
      name: 'Maseru Apparel Manufacturers',
      industry: 'Manufacturing',
      location: 'Maseru, Lesotho',
      description: 'Leading garment manufacturer producing high-quality apparel for international markets while creating employment opportunities locally.',
      tagline: 'Quality apparel, quality lives',
      logo: 'https://via.placeholder.com/100x100/e74c3c/ffffff?text=MAM',
      website: 'https://maseruapparel.ls',
      email: 'info@maseruapparel.ls',
      phone: '+266 2234 7890',
      address: '789 Industrial Area, Thetsane, Maseru',
      size: '1000+ employees',
      founded: '2005',
      type: 'Private Limited',
      jobCount: 12,
      cultureTags: ['Teamwork', 'Quality-focused', 'Hardworking', 'Reliable'],
      benefits: [
        'Transport allowance',
        'Overtime pay',
        'Safety bonuses',
        'Skill development'
      ],
      isActive: true
    },
    {
      id: '4',
      name: 'Highland Healthcare',
      industry: 'Healthcare',
      location: 'Maseru, Lesotho',
      description: 'Modern healthcare facility providing comprehensive medical services with state-of-the-art equipment and qualified professionals.',
      tagline: 'Caring for our community',
      logo: 'https://via.placeholder.com/100x100/9b59b6/ffffff?text=HHC',
      website: 'https://highlandhealth.ls',
      email: 'careers@highlandhealth.ls',
      phone: '+266 2231 2345',
      address: '321 Health Street, Maseru 100, Lesotho',
      size: '100-200 employees',
      founded: '2010',
      type: 'Private Practice',
      jobCount: 6,
      cultureTags: ['Compassionate', 'Professional', 'Team-oriented', 'Service-focused'],
      benefits: [
        'Medical insurance',
        'Professional development',
        'Flexible schedules',
        'Continuing education'
      ],
      isActive: true
    }
  ];
};

const getMockJobs = () => {
  return [
    {
      id: '1',
      title: 'Software Developer',
      company: 'Tech Solutions Lesotho',
      companyId: '1',
      location: 'Maseru',
      type: 'Full-time',
      salary: 'M15,000 - M20,000',
      description: 'We are looking for a skilled software developer to join our team...',
      requirements: ['Bachelor in Computer Science', '2+ years experience', 'JavaScript, React, Node.js'],
      postedDate: '2023-12-01'
    },
    {
      id: '2',
      title: 'Marketing Manager',
      company: 'Growth Marketing Ltd',
      location: 'Maseru',
      type: 'Full-time',
      salary: 'M12,000 - M16,000',
      description: 'Seeking an experienced marketing manager to lead our campaigns...',
      requirements: ['Bachelor in Marketing', '3+ years experience', 'Digital marketing skills'],
      postedDate: '2023-12-05'
    }
  ];
};

const getMockInstitutions = () => {
  return [
    {
      id: '1',
      name: 'National University of Lesotho',
      location: 'Roma, Maseru',
      description: 'The premier institution of higher learning in Lesotho offering diverse academic programs.',
      coursesCount: 45,
      studentsCount: 8000,
      contactEmail: 'admissions@nul.ls',
      phone: '+266 2234 0000',
      website: 'https://www.nul.ls'
    },
    {
      id: '2',
      name: 'Limkokwing University of Creative Technology',
      location: 'Maseru',
      description: 'A global university with focus on creativity, innovation and technology.',
      coursesCount: 32,
      studentsCount: 3500,
      contactEmail: 'info@limkokwing.ls',
      phone: '+266 2231 2135',
      website: 'https://www.limkokwing.ls'
    },
    {
      id: '3',
      name: 'Botho University',
      location: 'Maseru',
      description: 'Committed to providing quality education with industry-relevant programs.',
      coursesCount: 28,
      studentsCount: 2800,
      contactEmail: 'admissions@botho.ls',
      phone: '+266 2232 5757',
      website: 'https://www.botho.ls'
    }
  ];
};

const getMockCourses = () => {
  return [
    {
      id: '1',
      name: 'Computer Science',
      institutionId: '1',
      institutionName: 'National University of Lesotho',
      description: 'Bachelor of Science in Computer Science with focus on software development, algorithms, and computer systems.',
      duration: '4 years',
      fee: '25,000',
      requirements: ['Mathematics B', 'Physical Science C', 'English C'],
      capacity: 100,
      faculty: 'Science and Technology'
    },
    {
      id: '2',
      name: 'Business Administration',
      institutionId: '2',
      institutionName: 'Limkokwing University of Creative Technology',
      description: 'Bachelor of Business Administration with specializations in management, marketing, and entrepreneurship.',
      duration: '3 years',
      fee: '22,000',
      requirements: ['Mathematics D', 'English C', 'Commerce C'],
      capacity: 80,
      faculty: 'Business Management'
    }
  ];
};

// Initialize sample data
export const initializeSampleData = async () => {
  try {
    console.log('Starting database initialization...');
    
    // Check if institutions already exist
    const institutionsSnapshot = await get(ref(db, 'institutions'));
    if (!institutionsSnapshot.exists()) {
      console.log('Adding sample institutions...');
      const institutions = getMockInstitutions();
      for (const institution of institutions) {
        const newRef = push(ref(db, 'institutions'));
        await set(newRef, {
          ...institution,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Sample institutions added successfully!');
    }

    // Check if courses already exist
    const coursesSnapshot = await get(ref(db, 'courses'));
    if (!coursesSnapshot.exists()) {
      console.log('Adding sample courses...');
      const courses = getMockCourses();
      for (const course of courses) {
        const newRef = push(ref(db, 'courses'));
        await set(newRef, {
          ...course,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Sample courses added successfully!');
    }

    // Check if companies already exist
    const companiesSnapshot = await get(ref(db, 'companies'));
    if (!companiesSnapshot.exists()) {
      console.log('Adding sample companies...');
      const companies = getMockCompanies();
      for (const company of companies) {
        const newRef = push(ref(db, 'companies'));
        await set(newRef, {
          ...company,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Sample companies added successfully!');
    }

    console.log('Database initialization completed!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};