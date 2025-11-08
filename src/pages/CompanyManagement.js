import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { ref, onValue, off } from 'firebase/database';
import './CompanyManagement.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Hardcoded legitimate Lesotho companies
  const hardcodedCompanies = [
    {
      id: '1',
      name: 'Standard Bank Lesotho',
      industry: 'Banking & Finance',
      location: 'Maseru, Lesotho',
      description: 'One of the largest financial institutions in Lesotho, providing comprehensive banking services to individuals, businesses, and corporations. We are committed to driving economic growth and financial inclusion across the Kingdom.',
      tagline: 'Moving Forward',
      logo: 'https://via.placeholder.com/100x100/0033A0/ffffff?text=SBL',
      website: 'https://www.standardbank.co.ls',
      email: 'careers@standardbank.co.ls',
      phone: '+266 2231 2200',
      address: 'Standard Bank House, Kingsway Street, Maseru 100',
      size: '300-500 employees',
      founded: '1975',
      type: 'Public Limited Company',
      jobCount: 12,
      cultureTags: ['Professional', 'Customer-focused', 'Innovative', 'Ethical'],
      benefits: [
        'Competitive salary packages',
        'Medical aid and pension',
        'Staff loan facilities',
        'Professional development',
        'Performance bonuses',
        'Family health coverage'
      ]
    },
    {
      id: '2',
      name: 'Vodacom Lesotho',
      industry: 'Telecommunications',
      location: 'Maseru, Lesotho',
      description: 'Leading telecommunications provider in Lesotho, connecting people and businesses through innovative mobile and digital solutions. We are at the forefront of Lesotho\'s digital transformation.',
      tagline: 'The Future is Exciting. Ready?',
      logo: 'https://via.placeholder.com/100x100/E60000/ffffff?text=VCL',
      website: 'https://www.vodacom.co.ls',
      email: 'recruitment@vodacom.co.ls',
      phone: '+266 2231 4000',
      address: 'Vodacom House, Parliament Road, Maseru',
      size: '200-400 employees',
      founded: '1996',
      type: 'Public Limited Company',
      jobCount: 8,
      cultureTags: ['Innovative', 'Fast-paced', 'Tech-driven', 'Customer-obsessed'],
      benefits: [
        'Comprehensive medical aid',
        'Communication allowances',
        'Training and development',
        'Performance incentives',
        'Retirement benefits',
        'Flexible work arrangements'
      ]
    },
    {
      id: '3',
      name: 'Lesotho Flour Mills',
      industry: 'Manufacturing & Food Processing',
      location: 'Maputsoe, Lesotho',
      description: 'Premier flour milling and food processing company in Lesotho, producing high-quality wheat flour, maize meal, and animal feeds. We play a vital role in the nation\'s food security.',
      tagline: 'Nourishing the Nation',
      logo: 'https://via.placeholder.com/100x100/FF6B00/ffffff?text=LFM',
      website: 'https://www.lesothoflourmills.co.ls',
      email: 'hr@lfm.co.ls',
      phone: '+266 2250 0350',
      address: 'Industrial Area, Maputsoe 350, Leribe District',
      size: '150-250 employees',
      founded: '1982',
      type: 'Private Limited Company',
      jobCount: 5,
      cultureTags: ['Quality-focused', 'Reliable', 'Team-oriented', 'Traditional'],
      benefits: [
        'Housing allowance',
        'Production bonuses',
        'Safety equipment provided',
        'Transport services',
        'Medical coverage',
        'Long service awards'
      ]
    },
    {
      id: '4',
      name: 'Maseru Private Hospital',
      industry: 'Healthcare',
      location: 'Maseru, Lesotho',
      description: 'State-of-the-art private healthcare facility offering comprehensive medical services, specialized treatments, and emergency care. We are committed to providing world-class healthcare to the Basotho nation.',
      tagline: 'Your Health, Our Priority',
      logo: 'https://via.placeholder.com/100x100/008000/ffffff?text=MPH',
      website: 'https://www.maseruhospital.co.ls',
      email: 'careers@maseruhospital.co.ls',
      phone: '+266 2231 2231',
      address: '100 Mabile Road, Maseru West, Maseru',
      size: '100-200 employees',
      founded: '2005',
      type: 'Private Hospital',
      jobCount: 15,
      cultureTags: ['Compassionate', 'Professional', 'Lifesaving', 'Team-driven'],
      benefits: [
        'Comprehensive health insurance',
        'Professional indemnity cover',
        'Continuing medical education',
        'Housing allowance',
        'Shift allowances',
        'Recognition programs'
      ]
    },
    {
      id: '5',
      name: 'Lesotho Revenue Authority',
      industry: 'Government & Public Service',
      location: 'Maseru, Lesotho',
      description: 'National revenue collection agency responsible for tax administration and customs services. We play a crucial role in mobilizing resources for national development and public services.',
      tagline: 'Serving the Nation with Integrity',
      logo: 'https://via.placeholder.com/100x100/800080/ffffff?text=LRA',
      website: 'https://www.lra.org.ls',
      email: 'recruitment@lra.org.ls',
      phone: '+266 2231 3736',
      address: 'LRA Building, Constitution Road, Maseru',
      size: '400-600 employees',
      founded: '2003',
      type: 'Government Agency',
      jobCount: 10,
      cultureTags: ['Integrity', 'Professional', 'Service-oriented', 'Accountable'],
      benefits: [
        'Government pension scheme',
        'Medical aid',
        'Housing allowance',
        'Professional development',
        'Job security',
        'Generous leave packages'
      ]
    },
    {
      id: '6',
      name: 'Letseng Diamonds',
      industry: 'Mining',
      location: 'Letseng, Mokhotlong District',
      description: 'World-renowned diamond mining company operating one of the highest dollar-per-carat kimberlite diamond mines. We are known for producing large, high-quality diamonds and sustainable mining practices.',
      tagline: 'Exceptional Diamonds, Exceptional People',
      logo: 'https://via.placeholder.com/100x100/0047AB/ffffff?text=LDL',
      website: 'https://www.letseng.co.ls',
      email: 'hr@letseng.co.ls',
      phone: '+266 2290 0200',
      address: 'Letseng Mine, Mokhotlong District 500',
      size: '600-800 employees',
      founded: '1977',
      type: 'Mining Company',
      jobCount: 20,
      cultureTags: ['Safety-first', 'High-performance', 'Technical', 'Remote-work'],
      benefits: [
        'Competitive mining salaries',
        'Remote area allowances',
        'Comprehensive safety equipment',
        'Rotation schedules',
        'Housing and meals provided',
        'Performance bonuses'
      ]
    },
    {
      id: '7',
      name: 'BEDCO (Basotho Enterprises Development Corporation)',
      industry: 'Development & SME Support',
      location: 'Maseru, Lesotho',
      description: 'Government development agency focused on promoting entrepreneurship and supporting small to medium enterprises. We provide business development services, funding, and incubation support.',
      tagline: 'Empowering Basotho Entrepreneurs',
      logo: 'https://via.placeholder.com/100x100/FF4500/ffffff?text=BEDCO',
      website: 'https://www.bedco.org.ls',
      email: 'info@bedco.org.ls',
      phone: '+266 2231 2146',
      address: 'BEDCO House, Kingsway Street, Maseru',
      size: '50-100 employees',
      founded: '1980',
      type: 'Development Corporation',
      jobCount: 6,
      cultureTags: ['Empowering', 'Development-focused', 'Supportive', 'Impact-driven'],
      benefits: [
        'Development impact opportunities',
        'Training and capacity building',
        'Flexible work environment',
        'Community engagement',
        'Professional growth',
        'Public service benefits'
      ]
    },
    {
      id: '8',
      name: 'Nike Factory - Footwear Manufacturing',
      industry: 'Manufacturing - Footwear',
      location: 'Thetsane Industrial Area, Maseru',
      description: 'Leading footwear manufacturing facility producing world-class athletic shoes for international markets. We are committed to quality manufacturing and providing employment opportunities.',
      tagline: 'Quality Craftsmanship',
      logo: 'https://via.placeholder.com/100x100/000000/ffffff?text=NIKE',
      website: 'https://www.nike.com',
      email: 'lesothocareers@nike.com',
      phone: '+266 2231 5678',
      address: 'Thetsane Industrial Estate, Maseru',
      size: '1000+ employees',
      founded: '1999',
      type: 'Multinational Manufacturing',
      jobCount: 25,
      cultureTags: ['Quality-focused', 'Manufacturing excellence', 'Teamwork', 'Efficiency'],
      benefits: [
        'Stable manufacturing employment',
        'Overtime opportunities',
        'Quality bonuses',
        'Safety programs',
        'Skill development',
        'Transport services'
      ]
    }
  ];

  useEffect(() => {
    // Use hardcoded companies instead of Firebase
    setCompanies(hardcodedCompanies);
    setLoading(false);
    
    // Optional: Still listen to Firebase for updates, but use hardcoded as fallback
    const companiesRef = ref(db, 'companies');
    
    const unsubscribe = onValue(companiesRef, (snapshot) => {
      const companiesData = snapshot.val();
      if (companiesData) {
        const companiesList = Object.keys(companiesData).map(key => ({
          id: key,
          ...companiesData[key]
        }));
        setCompanies(companiesList);
      } else {
        // Use hardcoded if no data in Firebase
        setCompanies(hardcodedCompanies);
      }
      setLoading(false);
    });

    return () => off(companiesRef, 'value', unsubscribe);
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <div className="company-management-container">
        <div className="loading-spinner">Loading companies...</div>
      </div>
    );
  }

  if (selectedCompany) {
    return (
      <div className="company-management-container">
        <CompanyDetail 
          company={selectedCompany} 
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="company-management-container">
      <div className="company-header">
        <h1>Company Directory</h1>
        <p>Explore career opportunities with leading employers in Lesotho</p>
        <div className="companies-count">
          {filteredCompanies.length} companies found
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search companies by name, industry, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="companies-grid">
        {filteredCompanies.length === 0 ? (
          <div className="no-companies">
            <h3>No companies found</h3>
            <p>Try adjusting your search terms or check back later for new opportunities.</p>
          </div>
        ) : (
          filteredCompanies.map(company => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              onClick={handleCompanyClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

const CompanyCard = ({ company, onClick }) => {
  return (
    <div className="company-card" onClick={() => onClick(company)}>
      <div className="company-logo">
        {company.logo ? (
          <img src={company.logo} alt={`${company.name} logo`} />
        ) : (
          <div className="logo-placeholder">
            {company.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="company-info">
        <h3>{company.name}</h3>
        <p className="company-industry">{company.industry}</p>
        <p className="company-location">{company.location}</p>
        <div className="company-stats">
          <span>{company.jobCount || 0} open positions</span>
        </div>
      </div>
      <div className="explore-badge">View Details →</div>
    </div>
  );
};

const CompanyDetail = ({ company, onBack }) => {
  return (
    <div className="company-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to Companies
      </button>

      <div className="company-hero">
        <div className="company-hero-logo">
          {company.logo ? (
            <img src={company.logo} alt={`${company.name} logo`} />
          ) : (
            <div className="logo-placeholder large">
              {company.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="company-hero-info">
          <h1>{company.name}</h1>
          <p className="company-tagline">{company.tagline}</p>
          <div className="company-meta">
            <span className="industry-badge">{company.industry}</span>
            <span className="location">📍 {company.location}</span>
            <span className="size">👥 {company.size || 'Not specified'}</span>
          </div>
        </div>
      </div>

      <div className="company-content">
        <div className="main-content">
          <section className="about-section">
            <h2>About {company.name}</h2>
            <p>{company.description || 'No description available.'}</p>
          </section>

          <section className="culture-section">
            <h2>Company Culture</h2>
            <div className="culture-tags">
              {company.cultureTags?.map((tag, index) => (
                <span key={index} className="culture-tag">{tag}</span>
              )) || <p>No culture information available.</p>}
            </div>
          </section>

          {company.benefits && company.benefits.length > 0 && (
            <section className="benefits-section">
              <h2>Employee Benefits</h2>
              <ul className="benefits-list">
                {company.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="sidebar">
          <div className="contact-card">
            <h3>Contact Information</h3>
            {company.website && (
              <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
            )}
            {company.email && (
              <p><strong>Email:</strong> {company.email}</p>
            )}
            {company.phone && (
              <p><strong>Phone:</strong> {company.phone}</p>
            )}
            {company.address && (
              <p><strong>Address:</strong> {company.address}</p>
            )}
          </div>

          <div className="stats-card">
            <h3>Company Stats</h3>
            <p><strong>Open Positions:</strong> {company.jobCount || 0}</p>
            <p><strong>Founded:</strong> {company.founded || 'Not specified'}</p>
            <p><strong>Company Size:</strong> {company.size || 'Not specified'}</p>
            <p><strong>Type:</strong> {company.type || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement;