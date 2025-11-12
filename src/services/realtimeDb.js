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
      name: 'National University of Lesotho (NUL)',
      location: 'Roma, Maseru',
      description: 'The premier institution of higher learning in Lesotho offering diverse academic programs across multiple faculties. Established in 1945, it is the oldest and largest university in Lesotho.',
      coursesCount: 45,
      studentsCount: 8000,
      contactEmail: 'admissions@nul.ls',
      phone: '+266 2234 0000',
      website: 'https://www.nul.ls',
      established: '1945',
      type: 'Public University'
    },
    {
      id: '2',
      name: 'Limkokwing University of Creative Technology',
      location: 'Maseru',
      description: 'A global university with focus on creativity, innovation and technology. Known for its industry-relevant programs and modern teaching methods.',
      coursesCount: 32,
      studentsCount: 3500,
      contactEmail: 'info@limkokwing.ls',
      phone: '+266 2231 2135',
      website: 'https://www.limkokwing.ls',
      established: '2008',
      type: 'Private University'
    },
    {
      id: '3',
      name: 'Botho University',
      location: 'Maseru',
      description: 'Committed to providing quality education with industry-relevant programs. Part of an international network with campuses across Southern Africa.',
      coursesCount: 28,
      studentsCount: 2800,
      contactEmail: 'admissions@botho.ls',
      phone: '+266 2232 5757',
      website: 'https://www.botho.ls',
      established: '1997',
      type: 'Private University'
    },
    {
      id: '4',
      name: 'Lesotho College of Education',
      location: 'Maseru',
      description: 'The premier teacher training institution in Lesotho, dedicated to producing qualified educators for primary and secondary schools nationwide.',
      coursesCount: 15,
      studentsCount: 1200,
      contactEmail: 'registrar@lce.ac.ls',
      phone: '+266 2232 3561',
      website: 'https://www.lce.ac.ls',
      established: '1975',
      type: 'Public College'
    },
    {
      id: '5',
      name: 'Lesotho Agricultural College',
      location: 'Maseru',
      description: 'Specialized institution focused on agricultural sciences, agribusiness, and rural development. Contributing to food security and sustainable farming.',
      coursesCount: 12,
      studentsCount: 800,
      contactEmail: 'admissions@lac.edu.ls',
      phone: '+266 2231 0456',
      website: 'https://www.lac.edu.ls',
      established: '1955',
      type: 'Public College'
    },
    {
      id: '6',
      name: 'Lesotho Institute of Public Administration (LIPAM)',
      location: 'Maseru',
      description: 'Government institution providing training and development for public servants and offering degree programs in public administration and management.',
      coursesCount: 18,
      studentsCount: 1500,
      contactEmail: 'info@lipam.org.ls',
      phone: '+266 2231 2789',
      website: 'https://www.lipam.org.ls',
      established: '1980',
      type: 'Government Institute'
    },
    {
      id: '7',
      name: 'Centre for Accounting Studies (CAS)',
      location: 'Maseru',
      description: 'Specialized institution offering professional accounting qualifications and business-related degree programs. Recognized for producing qualified accountants.',
      coursesCount: 10,
      studentsCount: 600,
      contactEmail: 'admissions@cas.ac.ls',
      phone: '+266 2231 2345',
      website: 'https://www.cas.ac.ls',
      established: '1990',
      type: 'Private College'
    },
    {
      id: '8',
      name: 'Lesotho Nursing School',
      location: 'Queen Elizabeth II Hospital, Maseru',
      description: 'Leading institution for nursing and midwifery education, producing healthcare professionals to serve in hospitals and clinics across Lesotho.',
      coursesCount: 8,
      studentsCount: 400,
      contactEmail: 'principal@nursingschool.ls', 
      phone: '+266 2231 2678',
      website: 'https://www.lesothonursing.edu.ls',
      established: '1963',
      type: 'Public College'
    }
  ];
};

const getMockCourses = () => {
  return [
    // National University of Lesotho (5 courses)
    {
      id: '1',
      name: 'Bachelor of Science in Computer Science',
      institutionId: '1',
      institutionName: 'National University of Lesotho (NUL)',
      description: 'Comprehensive program covering software development, algorithms, database systems, and computer networks. Prepares students for careers in technology and software engineering.',
      duration: '4 years',
      fee: '25,000',
      requirements: ['Mathematics B', 'Physical Science C', 'English C', 'Minimum 5 LGCSE passes'],
      capacity: 120,
      faculty: 'Science and Technology',
      degreeType: 'Bachelor',
      intake: 'August'
    },
    {
      id: '2',
      name: 'Bachelor of Commerce in Accounting',
      institutionId: '1',
      institutionName: 'National University of Lesotho (NUL)',
      description: 'Professional accounting program preparing students for careers in auditing, taxation, financial management, and professional accounting qualifications.',
      duration: '4 years',
      fee: '23,000',
      requirements: ['Mathematics C', 'English C', 'Accounting C', 'Minimum 5 LGCSE passes'],
      capacity: 100,
      faculty: 'Business Administration',
      degreeType: 'Bachelor',
      intake: 'August'
    },
    {
      id: '3',
      name: 'Bachelor of Arts in Development Studies',
      institutionId: '1',
      institutionName: 'National University of Lesotho (NUL)',
      description: 'Interdisciplinary program focusing on social, economic, and political aspects of development. Prepares students for careers in NGOs, government, and international organizations.',
      duration: '4 years',
      fee: '20,000',
      requirements: ['English C', 'History/Geography C', 'Minimum 5 LGCSE passes'],
      capacity: 80,
      faculty: 'Humanities',
      degreeType: 'Bachelor',
      intake: 'August'
    },
    {
      id: '4',
      name: 'Bachelor of Education (Secondary)',
      institutionId: '1',
      institutionName: 'National University of Lesotho (NUL)',
      description: 'Teacher education program for secondary school teaching. Students specialize in two teaching subjects and receive practical teaching experience.',
      duration: '4 years',
      fee: '18,000',
      requirements: ['English C', 'Two teaching subjects at C level', 'Minimum 5 LGCSE passes'],
      capacity: 90,
      faculty: 'Education',
      degreeType: 'Bachelor',
      intake: 'August'
    },
    {
      id: '5',
      name: 'Bachelor of Laws (LLB)',
      institutionId: '1',
      institutionName: 'National University of Lesotho (NUL)',
      description: 'Professional law degree program covering various legal disciplines. Prepares students for legal practice and careers in judiciary, government, and corporate sectors.',
      duration: '4 years',
      fee: '28,000',
      requirements: ['English B', 'Minimum 5 LGCSE passes including English and Mathematics'],
      capacity: 60,
      faculty: 'Law',
      degreeType: 'Bachelor',
      intake: 'August'
    },

    // Limkokwing University (5 courses)
    {
      id: '6',
      name: 'Bachelor of Business Administration',
      institutionId: '2',
      institutionName: 'Limkokwing University of Creative Technology',
      description: 'Modern business management program with focus on entrepreneurship, digital marketing, and international business. Includes industry attachments and practical projects.',
      duration: '3 years',
      fee: '26,000',
      requirements: ['Mathematics D', 'English C', 'Minimum 4 LGCSE passes'],
      capacity: 75,
      faculty: 'Business Management',
      degreeType: 'Bachelor',
      intake: 'January, May, September'
    },
    {
      id: '7',
      name: 'Bachelor of Information Technology',
      institutionId: '2',
      institutionName: 'Limkokwing University of Creative Technology',
      description: 'Hands-on IT program focusing on web development, mobile applications, networking, and cybersecurity. Emphasizes practical skills and industry certifications.',
      duration: '3 years',
      fee: '27,000',
      requirements: ['Mathematics C', 'English C', 'Computer Studies D', 'Minimum 4 LGCSE passes'],
      capacity: 70,
      faculty: 'Information Technology',
      degreeType: 'Bachelor',
      intake: 'January, May, September'
    },
    {
      id: '8',
      name: 'Bachelor of Design in Graphic Design',
      institutionId: '2',
      institutionName: 'Limkokwing University of Creative Technology',
      description: 'Creative program covering digital design, branding, illustration, and multimedia. Students work with industry-standard software and build professional portfolios.',
      duration: '3 years',
      fee: '25,000',
      requirements: ['English C', 'Art/Design subject D', 'Minimum 4 LGCSE passes'],
      capacity: 50,
      faculty: 'Creative Arts',
      degreeType: 'Bachelor',
      intake: 'January, May, September'
    },
    {
      id: '9',
      name: 'Bachelor of Public Relations',
      institutionId: '2',
      institutionName: 'Limkokwing University of Creative Technology',
      description: 'Comprehensive PR and communications program covering media relations, corporate communications, event management, and digital media strategies.',
      duration: '3 years',
      fee: '24,000',
      requirements: ['English C', 'Commerce/History D', 'Minimum 4 LGCSE passes'],
      capacity: 45,
      faculty: 'Communications',
      degreeType: 'Bachelor',
      intake: 'January, May, September'
    },
    {
      id: '10',
      name: 'Bachelor of Fashion Design',
      institutionId: '2',
      institutionName: 'Limkokwing University of Creative Technology',
      description: 'Creative fashion program covering design principles, textile technology, pattern making, and fashion business management. Includes fashion show participation.',
      duration: '3 years',
      fee: '26,500',
      requirements: ['English C', 'Art/Design subject D', 'Minimum 4 LGCSE passes'],
      capacity: 40,
      faculty: 'Fashion and Design',
      degreeType: 'Bachelor',
      intake: 'January, May, September'
    },

    // Botho University (5 courses)
    {
      id: '11',
      name: 'Bachelor of Accounting',
      institutionId: '3',
      institutionName: 'Botho University',
      description: 'Professional accounting program aligned with international standards. Prepares students for ACCA, CIMA, and other professional accounting qualifications.',
      duration: '4 years',
      fee: '24,000',
      requirements: ['Mathematics C', 'English C', 'Accounting D', 'Minimum 5 LGCSE passes'],
      capacity: 85,
      faculty: 'Business and Accounting',
      degreeType: 'Bachelor',
      intake: 'January, August'
    },
    {
      id: '12',
      name: 'Bachelor of Science in Hospitality Management',
      institutionId: '3',
      institutionName: 'Botho University',
      description: 'Comprehensive hospitality program covering hotel operations, tourism management, event planning, and customer service excellence in the tourism industry.',
      duration: '4 years',
      fee: '23,500',
      requirements: ['English C', 'Mathematics D', 'Minimum 4 LGCSE passes'],
      capacity: 60,
      faculty: 'Hospitality and Tourism',
      degreeType: 'Bachelor',
      intake: 'January, August'
    },
    {
      id: '13',
      name: 'Bachelor of Information Systems',
      institutionId: '3',
      institutionName: 'Botho University',
      description: 'Business-oriented IT program focusing on system analysis, database management, business intelligence, and IT project management for organizational efficiency.',
      duration: '4 years',
      fee: '25,500',
      requirements: ['Mathematics C', 'English C', 'Minimum 5 LGCSE passes'],
      capacity: 65,
      faculty: 'Computing',
      degreeType: 'Bachelor',
      intake: 'January, August'
    },
    {
      id: '14',
      name: 'Bachelor of Business Management',
      institutionId: '3',
      institutionName: 'Botho University',
      description: 'General management program covering all business functions with specializations in marketing, human resources, operations, and strategic management.',
      duration: '4 years',
      fee: '23,000',
      requirements: ['English C', 'Mathematics D', 'Commerce D', 'Minimum 4 LGCSE passes'],
      capacity: 80,
      faculty: 'Business Management',
      degreeType: 'Bachelor',
      intake: 'January, August'
    },
    {
      id: '15',
      name: 'Bachelor of Public Health',
      institutionId: '3',
      institutionName: 'Botho University',
      description: 'Health sciences program focusing on community health, epidemiology, health promotion, and public health policy. Addresses health challenges in Lesotho.',
      duration: '4 years',
      fee: '22,000',
      requirements: ['English C', 'Science subject D', 'Mathematics D', 'Minimum 4 LGCSE passes'],
      capacity: 55,
      faculty: 'Health Sciences',
      degreeType: 'Bachelor',
      intake: 'January, August'
    },

    // Lesotho College of Education (5 courses)
    {
      id: '16',
      name: 'Diploma in Primary Education',
      institutionId: '4',
      institutionName: 'Lesotho College of Education',
      description: 'Two-year teacher training program for primary school teaching. Covers all primary school subjects and teaching methodologies for grades 1-7.',
      duration: '2 years',
      fee: '15,000',
      requirements: ['English C', 'Mathematics D', 'Minimum 4 LGCSE passes including English and Mathematics'],
      capacity: 120,
      faculty: 'Primary Education',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '17',
      name: 'Bachelor of Education (Primary)',
      institutionId: '4',
      institutionName: 'Lesotho College of Education',
      description: 'Four-year degree program for primary school teaching with deeper pedagogical knowledge and research skills. Includes teaching practice in schools.',
      duration: '4 years',
      fee: '18,000',
      requirements: ['English C', 'Mathematics D', 'Minimum 5 LGCSE passes'],
      capacity: 80,
      faculty: 'Primary Education',
      degreeType: 'Bachelor',
      intake: 'August'
    },
    {
      id: '18',
      name: 'Diploma in Secondary Education (Sciences)',
      institutionId: '4',
      institutionName: 'Lesotho College of Education',
      description: 'Specialized program for training science teachers. Covers teaching methodologies for Mathematics, Physical Science, and Biology at secondary level.',
      duration: '2 years',
      fee: '16,000',
      requirements: ['Mathematics C', 'Physical Science C', 'English C', 'Minimum 5 LGCSE passes'],
      capacity: 60,
      faculty: 'Science Education',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '19',
      name: 'Diploma in Secondary Education (Humanities)',
      institutionId: '4',
      institutionName: 'Lesotho College of Education',
      description: 'Teacher training program for humanities subjects. Prepares teachers for English, Sesotho, History, Geography, and Development Studies.',
      duration: '2 years',
      fee: '15,500',
      requirements: ['English C', 'Sesotho C', 'History/Geography C', 'Minimum 5 LGCSE passes'],
      capacity: 70,
      faculty: 'Humanities Education',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '20',
      name: 'Certificate in Early Childhood Education',
      institutionId: '4',
      institutionName: 'Lesotho College of Education',
      description: 'One-year program focusing on early childhood development and pre-primary education. Covers child psychology, play-based learning, and kindergarten management.',
      duration: '1 year',
      fee: '12,000',
      requirements: ['English D', 'Minimum 3 LGCSE passes'],
      capacity: 100,
      faculty: 'Early Childhood Education',
      degreeType: 'Certificate',
      intake: 'August'
    },

    // Lesotho Agricultural College (5 courses)
    {
      id: '21',
      name: 'Diploma in General Agriculture',
      institutionId: '5',
      institutionName: 'Lesotho Agricultural College',
      description: 'Comprehensive agriculture program covering crop production, animal husbandry, soil science, and farm management. Includes practical farm training.',
      duration: '3 years',
      fee: '14,000',
      requirements: ['Science subject C', 'Mathematics D', 'English D', 'Minimum 4 LGCSE passes'],
      capacity: 75,
      faculty: 'Agriculture',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '22',
      name: 'Diploma in Animal Production',
      institutionId: '5',
      institutionName: 'Lesotho Agricultural College',
      description: 'Specialized program focusing on livestock management, animal nutrition, veterinary basics, and animal product processing for the livestock industry.',
      duration: '3 years',
      fee: '15,000',
      requirements: ['Science subject C', 'Mathematics D', 'English D', 'Minimum 4 LGCSE passes'],
      capacity: 50,
      faculty: 'Animal Science',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '23',
      name: 'Diploma in Crop Production',
      institutionId: '5',
      institutionName: 'Lesotho Agricultural College',
      description: 'Focused program on crop science, horticulture, soil management, and sustainable farming practices. Addresses food security and agricultural productivity.',
      duration: '3 years',
      fee: '14,500',
      requirements: ['Science subject C', 'Mathematics D', 'English D', 'Minimum 4 LGCSE passes'],
      capacity: 55,
      faculty: 'Crop Science',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '24',
      name: 'Certificate in Agro-Business',
      institutionId: '5',
      institutionName: 'Lesotho Agricultural College',
      description: 'One-year program combining agriculture with business skills. Covers farm economics, marketing, agri-entrepreneurship, and agricultural value chains.',
      duration: '1 year',
      fee: '11,000',
      requirements: ['English D', 'Mathematics D', 'Minimum 3 LGCSE passes'],
      capacity: 40,
      faculty: 'Agribusiness',
      degreeType: 'Certificate',
      intake: 'August'
    },
    {
      id: '25',
      name: 'Diploma in Agricultural Extension',
      institutionId: '5',
      institutionName: 'Lesotho Agricultural College',
      description: 'Program training agricultural extension officers. Focuses on farmer education, community development, and technology transfer in rural areas.',
      duration: '2 years',
      fee: '13,000',
      requirements: ['English C', 'Science subject D', 'Minimum 4 LGCSE passes'],
      capacity: 45,
      faculty: 'Agricultural Extension',
      degreeType: 'Diploma',
      intake: 'August'
    },

    // LIPAM (5 courses)
    {
      id: '26',
      name: 'Diploma in Public Administration',
      institutionId: '6',
      institutionName: 'Lesotho Institute of Public Administration (LIPAM)',
      description: 'Professional program for public servants covering public policy, administrative law, human resource management, and governance in public sector.',
      duration: '2 years',
      fee: '16,000',
      requirements: ['English C', 'Minimum 5 LGCSE passes', 'Currently employed in public service'],
      capacity: 60,
      faculty: 'Public Administration',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '27',
      name: 'Certificate in Local Government Management',
      institutionId: '6',
      institutionName: 'Lesotho Institute of Public Administration (LIPAM)',
      description: 'Specialized program for local government officials covering municipal administration, community development, and local governance structures.',
      duration: '1 year',
      fee: '12,500',
      requirements: ['English C', 'Minimum 4 LGCSE passes', 'Working in local government'],
      capacity: 50,
      faculty: 'Local Governance',
      degreeType: 'Certificate',
      intake: 'August'
    },
    {
      id: '28',
      name: 'Diploma in Human Resource Management',
      institutionId: '6',
      institutionName: 'Lesotho Institute of Public Administration (LIPAM)',
      description: 'HR management program focusing on public sector HR practices, labor relations, performance management, and organizational development.',
      duration: '2 years',
      fee: '15,500',
      requirements: ['English C', 'Minimum 5 LGCSE passes'],
      capacity: 55,
      faculty: 'Human Resources',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '29',
      name: 'Certificate in Project Management',
      institutionId: '6',
      institutionName: 'Lesotho Institute of Public Administration (LIPAM)',
      description: 'Practical project management training covering project planning, implementation, monitoring, and evaluation in public sector context.',
      duration: '1 year',
      fee: '13,000',
      requirements: ['English C', 'Mathematics D', 'Minimum 4 LGCSE passes'],
      capacity: 65,
      faculty: 'Project Management',
      degreeType: 'Certificate',
      intake: 'August'
    },
    {
      id: '30',
      name: 'Diploma in Financial Management',
      institutionId: '6',
      institutionName: 'Lesotho Institute of Public Administration (LIPAM)',
      description: 'Public financial management program covering budgeting, accounting, financial controls, and procurement in government institutions.',
      duration: '2 years',
      fee: '16,500',
      requirements: ['English C', 'Mathematics C', 'Minimum 5 LGCSE passes'],
      capacity: 45,
      faculty: 'Financial Management',
      degreeType: 'Diploma',
      intake: 'August'
    },

    // Centre for Accounting Studies (5 courses)
    {
      id: '31',
      name: 'ACCA Fundamentals Program',
      institutionId: '7',
      institutionName: 'Centre for Accounting Studies (CAS)',
      description: 'Professional accounting qualification covering financial accounting, management accounting, taxation, and audit. Leads to ACCA membership.',
      duration: '2-3 years',
      fee: '30,000',
      requirements: ['Mathematics C', 'English C', 'Minimum 5 LGCSE passes including English and Mathematics'],
      capacity: 100,
      faculty: 'Professional Accounting',
      degreeType: 'Professional',
      intake: 'January, July'
    },
    {
      id: '32',
      name: 'Diploma in Accounting and Business',
      institutionId: '7',
      institutionName: 'Centre for Accounting Studies (CAS)',
      description: 'Foundation program in accounting and business principles. Serves as entry point for professional accounting qualifications and business careers.',
      duration: '1 year',
      fee: '18,000',
      requirements: ['English C', 'Mathematics D', 'Minimum 4 LGCSE passes'],
      capacity: 80,
      faculty: 'Accounting',
      degreeType: 'Diploma',
      intake: 'January, July'
    },
    {
      id: '33',
      name: 'Certificate in Payroll Administration',
      institutionId: '7',
      institutionName: 'Centre for Accounting Studies (CAS)',
      description: 'Specialized program focusing on payroll processing, tax calculations, statutory deductions, and payroll software applications.',
      duration: '6 months',
      fee: '8,000',
      requirements: ['English D', 'Mathematics D', 'Minimum 3 LGCSE passes'],
      capacity: 40,
      faculty: 'Payroll Management',
      degreeType: 'Certificate',
      intake: 'January, April, July, October'
    },
    {
      id: '34',
      name: 'Diploma in Taxation',
      institutionId: '7',
      institutionName: 'Centre for Accounting Studies (CAS)',
      description: 'Comprehensive tax program covering income tax, VAT, corporate tax, and tax administration. Prepares students for tax consulting careers.',
      duration: '1 year',
      fee: '16,000',
      requirements: ['English C', 'Mathematics C', 'Accounting D', 'Minimum 4 LGCSE passes'],
      capacity: 35,
      faculty: 'Taxation',
      degreeType: 'Diploma',
      intake: 'January, July'
    },
    {
      id: '35',
      name: 'Certificate in Bookkeeping',
      institutionId: '7',
      institutionName: 'Centre for Accounting Studies (CAS)',
      description: 'Basic bookkeeping program covering double-entry system, financial records, bank reconciliation, and basic accounting software skills.',
      duration: '6 months',
      fee: '7,500',
      requirements: ['English D', 'Mathematics D', 'Minimum 2 LGCSE passes'],
      capacity: 60,
      faculty: 'Bookkeeping',
      degreeType: 'Certificate',
      intake: 'Rolling admissions'
    },

    // Lesotho Nursing School (5 courses)
    {
      id: '36',
      name: 'Diploma in General Nursing',
      institutionId: '8',
      institutionName: 'Lesotho Nursing School',
      description: 'Comprehensive nursing program covering medical-surgical nursing, community health, maternal-child health, and psychiatric nursing. Leads to registered nurse qualification.',
      duration: '3 years',
      fee: '20,000',
      requirements: ['English C', 'Mathematics C', 'Science subject C', 'Minimum 5 LGCSE passes'],
      capacity: 70,
      faculty: 'Nursing',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '37',
      name: 'Diploma in Midwifery',
      institutionId: '8',
      institutionName: 'Lesotho Nursing School',
      description: 'Specialized midwifery program focusing on maternal care, neonatal care, reproductive health, and family planning services.',
      duration: '1 year',
      fee: '15,000',
      requirements: ['Registered Nurse qualification', 'English C', 'Minimum 1 year nursing experience'],
      capacity: 30,
      faculty: 'Midwifery',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '38',
      name: 'Certificate in Nursing Assistant',
      institutionId: '8',
      institutionName: 'Lesotho Nursing School',
      description: 'Basic nursing care program training assistants for patient care, vital signs monitoring, basic procedures, and support to registered nurses.',
      duration: '1 year',
      fee: '12,000',
      requirements: ['English D', 'Science subject D', 'Minimum 3 LGCSE passes'],
      capacity: 50,
      faculty: 'Nursing Assistant',
      degreeType: 'Certificate',
      intake: 'August'
    },
    {
      id: '39',
      name: 'Diploma in Psychiatric Nursing',
      institutionId: '8',
      institutionName: 'Lesotho Nursing School',
      description: 'Specialized mental health nursing program covering psychiatric disorders, therapeutic communication, and mental health promotion.',
      duration: '1 year',
      fee: '16,000',
      requirements: ['Registered Nurse qualification', 'English C', 'Interest in mental health'],
      capacity: 25,
      faculty: 'Psychiatric Nursing',
      degreeType: 'Diploma',
      intake: 'August'
    },
    {
      id: '40',
      name: 'Certificate in Community Health',
      institutionId: '8',
      institutionName: 'Lesotho Nursing School',
      description: 'Community-focused program training health workers for primary healthcare, health education, disease prevention, and community outreach.',
      duration: '1 year',
      fee: '11,000',
      requirements: ['English D', 'Science subject D', 'Minimum 3 LGCSE passes'],
      capacity: 45,
      faculty: 'Community Health',
      degreeType: 'Certificate',
      intake: 'August'
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
