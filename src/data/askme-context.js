// Context data per AskMe RAG system
// Ultimo aggiornamento: Settembre 2025

export const askMeContext = {
  // ==================== INFORMAZIONI PERSONALI ====================
  personalInfo: {
    fullName: "Vittorio Loris Simonetti",
    role: "Electronic Engineer | SAP Solution Architect | Sales Solution Advisor",
    currentPosition: "Sales Solution Advisor & SAP Ariba Consultant at IBM",
    location: "Naples, Italy",
    dateOfBirth: "27/02/1994",
    email: "v.loris.simonetti@gmail.com",
    phone: "+393312619338",
    linkedin: "https://linkedin.com/in/vittorio-simonetti",
    github: "https://github.com/vittorio-simonetti",
    
    personalStatement: `I'm a passionate and curious Electronic Engineer, helping organizations to create more meaningful employee experiences and deliver smarter insights. The very crucial aspect of my job I like most is problem solving, both technically and functionally speaking. People coordination and knowledge transmission are not less important, because deeply stress the role we all have as educators and shapes somehow all the people we get in touch with. I focus on keeping solid advancement in personal, company and clients growth.`
  },

  // ==================== EDUCAZIONE ====================
  education: [
    {
      degree: "Master's Degree in Electronic Engineering",
      institution: "Università Federico II",
      location: "Naples, Italy",
      period: "2017 – 2020",
      field: "Electronic Engineering"
    },
    {
      degree: "Bachelor's Degree in Electronic Engineering",
      institution: "Università Federico II",
      location: "Naples, Italy",
      period: "2013 – 2017",
      field: "Electronic Engineering"
    }
  ],

  // ==================== ESPERIENZE LAVORATIVE ====================
  workExperience: [
    {
      title: "Sales Solution Advisor",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "March 2025 – Current",
      description: "Leading technical solutioning and offering development for IBM Consulting. Supporting sales team with technical expertise in SAP, Cloud, and AI solutions.",
      responsibilities: [
        "Technical solutioning for client proposals",
        "Solution architecture design for enterprise clients",
        "Pre-sales technical consulting",
        "Offering development and positioning"
      ]
    },
    {
      title: "SAP Ariba Consultant – Buying, Sourcing, SLP, Contract Management",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "May 2024 – Current",
      industries: ["Energy Environment & Utilities", "Lottery (International)"],
      description: "Configuring and managing comprehensive SAP Ariba solutions including Sourcing, Procurement with Guided Buying, and Supplier Lifecycle Performance. Working with SAP Integration Suite, Managed Gateway for Spend Management and SAP Business Network.",
      technologies: ["SAP Ariba Sourcing", "SAP Ariba Procurement", "SAP Ariba SLP", "Contract Management", "SAP Integration Suite", "SAP Business Network"],
      achievements: [
        "Successfully implemented end-to-end Ariba solutions",
        "Managed complex integrations with SAP backend systems",
        "Delivered guided buying functionality for improved user experience"
      ]
    },
    {
      title: "SAP Certified Solution Architect",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "November 2023 – Current",
      industries: ["Energy Environment & Utilities"],
      description: "Leading solution architecture initiatives across multiple SAP modules and technologies. Bridging technical teams, business stakeholders, and clients with clear and effective communication.",
      responsibilities: [
        "Solution design and architecture",
        "Requirements gathering and gap analysis",
        "Feasibility assessments",
        "Stakeholder management and client presentations",
        "Technical and functional specifications"
      ]
    },
    {
      title: "SAP EHS Team Leader",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "November 2023 – Current",
      industries: ["Energy Environment & Utilities"],
      description: "Leading SAP EHS (Environment, Health & Safety) module implementation and AMS. Successfully transformed an unfamiliar module into a recognized area of excellence.",
      achievements: [
        "Built expertise in SAP EHS from scratch",
        "Established team as trusted advisors for client",
        "Managed both enhancements and AMS activities"
      ]
    },
    {
      title: "Project Manager",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "March 2023 – Current",
      industries: ["Bank Industry (International)"],
      description: "Led multiple projects including a successful 1-year migration from SAP PI 7.4 to SAP PO 7.5 for an international banking client.",
      achievements: [
        "Delivered complex migration project on time",
        "Managed international stakeholders",
        "Coordinated cross-functional teams"
      ]
    },
    {
      title: "SAP Application Architect - SRM Team Leader",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "March 2022 – January 2024",
      industries: ["Environment Health Safety Management", "Bank", "Energy Environment & Utilities"],
      description: "Led digital transformation of SAP SRM applications to renewed Fiori architecture. Managed team of 3+ resources, teaching and growing the team.",
      keyProjects: [
        "SAP SRM to Fiori migration - full portfolio of Fiori Apps",
        "AMS and enhancement management",
        "ABAP developments and process customization",
        "Integration interfaces development"
      ],
      teamManagement: "Managed 3 young resources, teaching technical and soft skills"
    },
    {
      title: "SAP S/4 HANA Application Developer",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "April 2021 – February 2022",
      industries: ["Retail (International)"],
      description: "Greenfield implementation project for international retail client. Managed active invoicing process area and external system interfaces.",
      responsibilities: [
        "ABAP development for S/4HANA",
        "Interface development and testing",
        "Working with non-Italian stakeholders",
        "Setup, test, and release of solutions"
      ],
      achievement: "Project was a great success with full delivery on time"
    },
    {
      title: "SAP SRM Consultant",
      company: "IBM Client Innovation Center",
      location: "Naples, Italy",
      period: "June 2020 – March 2021",
      industries: ["Energy Environment & Utilities"],
      description: "Started career as SAP SRM Consultant on twin projects. Achieved independence in managing AMS and enhancements within 6 months.",
      achievement: "Managed both AMS and Enhancements alone after 6 months"
    }
  ],

  // ==================== COMPETENZE TECNICHE ====================
  technicalSkills: {
    sap: {
      ariba: {
        level: 80,
        modules: [
          "SAP Ariba Sourcing",
          "SAP Ariba Procurement",
          "SAP Ariba Buying",
          "SAP Ariba Contract Management",
          "SAP Ariba Supplier Lifecycle Performance (SLP)",
          "SAP Ariba Catalog Management",
          "Guided Buying"
        ],
        integrations: [
          "SAP Integration Suite",
          "Managed Gateway for Spend Management",
          "SAP Business Network"
        ]
      },
      srm: {
        level: 75,
        expertise: [
          "Standard and custom processes",
          "AMS management",
          "Enhancements",
          "Fiori migration"
        ]
      },
      ehs: {
        level: 75,
        description: "Environment, Health & Safety module"
      },
      s4hana: {
        level: 70,
        areas: [
          "Application development",
          "Active invoicing process",
          "External system interfaces",
          "Greenfield implementations"
        ]
      },
      fiori: {
        level: 65,
        experience: [
          "Fiori Apps development",
          "SAP UI5",
          "OData services",
          "Frontend-Backend integration"
        ]
      },
      btp: {
        level: 65,
        description: "SAP Business Technology Platform"
      },
      other: [
        "SAP HR",
        "SAP PI/PO (Process Integration/Orchestration)",
        "SAP Joule"
      ]
    },
    
    programming: {
      abap: {
        level: 90,
        expertise: [
          "ABAP development",
          "ABAP Cloud",
          "Custom developments",
          "Integration development",
          "Performance optimization"
        ]
      },
      javascript: {
        level: 85,
        frameworks: ["React", "Node.js", "HTML5", "CSS3"]
      },
      dart: {
        level: 70,
        description: "Flutter mobile development"
      },
      python: {
        level: 65,
        usage: "AI/ML projects, automation"
      }
    },

    cloud: {
      platforms: ["AWS", "Azure", "SAP BTP"],
      services: [
        "Cloud architecture design",
        "Cloud migration",
        "Containerization (Docker)",
        "Kubernetes"
      ]
    },

    ai: {
      level: 75,
      expertise: [
        "Generative AI",
        "IBM watsonx.ai",
        "AI integration in enterprise solutions",
        "Gen AI architecture",
        "Machine Learning basics"
      ],
      certifications: [
        "IBM watsonx.ai Technical Sales Advanced",
        "Gen AI Architect - Experienced"
      ]
    },

    architecture: {
      level: 85,
      certifications: [
        "Application Architect Certification – Level 1 Experienced (Open Group CA)"
      ],
      expertise: [
        "Solution architecture",
        "Enterprise architecture",
        "System design",
        "Integration patterns",
        "API design",
        "Scalable solutions"
      ]
    },

    methodologies: {
      agile: {
        level: 85,
        certification: "Registered Scrum Master (Scrum Inc.)",
        experience: [
          "Scrum Master",
          "Agile team leadership",
          "Sprint planning",
          "Design Thinking seminars"
        ]
      },
      tools: [
        "Monday.com",
        "Trello",
        "OneNote",
        "Microsoft Office Suite (90%)"
      ]
    },

    mobile: {
      flutter: {
        description: "Cross-platform mobile development",
        projects: ["iOS and Android application development"]
      }
    }
  },

  // ==================== SOFT SKILLS ====================
  softSkills: {
    leadership: {
      level: 90,
      experience: [
        "Team Lead managing 3+ resources",
        "People Manager (10 people as of 2025)",
        "Mentoring and teaching",
        "Stakeholder management",
        "Client relationship building"
      ]
    },
    
    communication: {
      level: 95,
      strengths: [
        "Bridging technical and business stakeholders",
        "Client presentations",
        "International collaboration",
        "Fluent English",
        "Technical concept simplification for executives"
      ]
    },

    problemSolving: {
      level: 95,
      description: "Both technical and functional problem solving. Ability to resolve critical issues and manage competing priorities."
    },

    solutioning: {
      level: 70,
      expertise: [
        "Requirements gathering",
        "Gap analysis",
        "Feasibility assessments",
        "Technical/functional specifications",
        "Pre-sales technical consulting"
      ]
    }
  },

  // ==================== PROGETTI RILEVANTI ====================
  keyProjects: [
    {
      name: "SAP Ariba End-to-End Implementation",
      period: "2024-Current",
      industry: "Energy, Environment & Utilities / Lottery",
      description: "Comprehensive implementation of SAP Ariba Sourcing, Procurement with Guided Buying, Supplier Lifecycle Performance, and Contract Management. Integrated with SAP backend using Integration Suite and Business Network.",
      role: "SAP Ariba Consultant",
      technologies: ["SAP Ariba", "SAP Integration Suite", "SAP Business Network"],
      achievements: [
        "Full implementation of Ariba upstream and downstream modules",
        "Successful integration with SAP backend systems",
        "Improved procurement efficiency for international client"
      ]
    },
    {
      name: "SAP SRM to Fiori Migration",
      period: "2022-2024",
      industry: "Energy, Environment & Utilities",
      description: "Led digital transformation from classic SAP SRM to modern Fiori architecture. Developed full portfolio of Fiori Apps replacing legacy interfaces.",
      role: "Team Lead & Architect",
      technologies: ["SAP Fiori", "SAP UI5", "ABAP", "OData"],
      achievements: [
        "Complete Fiori portfolio delivered",
        "Improved user experience significantly",
        "Recognized as great success story by client"
      ]
    },
    {
      name: "SAP PI 7.4 to PO 7.5 Migration",
      period: "2023-2024 (1 year)",
      industry: "Banking (International)",
      description: "Led migration project from SAP PI 7.4 to SAP PO 7.5 for international banking client.",
      role: "Associate Project Manager",
      achievements: [
        "Successful migration delivered on time",
        "Zero downtime during transition",
        "International stakeholder management"
      ]
    },
    {
      name: "S/4HANA Greenfield Implementation",
      period: "2021-2022",
      industry: "Retail (International)",
      description: "Greenfield S/4HANA implementation for international retail client. Responsible for active invoicing process and external system interfaces.",
      role: "SAP S/4 HANA Developer",
      technologies: ["S/4HANA", "ABAP", "Integration interfaces"],
      achievements: [
        "Delivered complete invoicing solution",
        "All interfaces tested and released successfully",
        "Project recognized as great success"
      ]
    },
    {
      name: "Mobile Application Development with Flutter",
      period: "2021 (6 months)",
      description: "Led internal IBM project for cross-platform mobile application development using Flutter and Dart frameworks.",
      role: "Associate Project Manager & Junior Architect",
      technologies: ["Flutter", "Dart", "iOS", "Android"],
      achievements: [
        "Cross-platform app delivered for iOS and Android",
        "Parallel development achieved",
        "Seamless user experience"
      ]
    },
    {
      name: "SAP Fiori Event Manager",
      period: "2021-2022",
      description: "Developed internal IBM application for corporate event management using full-stack approach.",
      role: "Full-stack Developer & Architect",
      technologies: ["HTML", "JavaScript", "CSS", "ABAP", "OData"],
      stack: "Frontend (HTML/JS/CSS), Backend (ABAP), Integration (OData)",
      achievements: [
        "Complete full-stack solution delivered",
        "Used across IBM for event management"
      ]
    },
    {
      name: "SAP Joule Proof of Concept",
      period: "2023",
      description: "Developed Proof of Experience/Proof of Concept application using SAP Joule for streamlining internal achievements.",
      role: "Solution Architect",
      technologies: ["SAP Joule", "SAP BTP"],
      achievement: "Successfully demonstrated new technology capabilities"
    }
  ],

  // ==================== PUBBLICAZIONI E BREVETTI ====================
  publications: [
    {
      title: "Catalog Management with SAP Ariba Catalog",
      type: "Book",
      publisher: "SAP Press",
      date: "August 2025",
      description: "Comprehensive guide on SAP Ariba Catalog management",
      link: "SAP Press publication"
    },
    {
      title: "Gen AI System to Support Impaired People",
      type: "Patent",
      status: "Filed at USPTO",
      year: "2024",
      description: "Generative AI system designed to assist people with impairments",
      confidential: true
    },
    {
      title: "Gen AI Application for HR Use Cases",
      type: "Research Paper",
      publisher: "ip.com",
      year: "2024",
      description: "Research publication on Generative AI applications in Human Resources",
      confidential: true
    }
  ],

  // ==================== CERTIFICAZIONI ====================
  certifications: [
    {
      name: "SAP Certified Solution Architect",
      issuer: "SAP",
      category: "SAP",
      year: "2023"
    },
    {
      name: "Application Architect Certification – Level 1 Experienced",
      issuer: "Open Group CA",
      category: "Architecture",
      year: "2023"
    },
    {
      name: "IBM Certified Experienced Consultant",
      issuer: "IBM",
      category: "Consulting",
      year: "2023"
    },
    {
      name: "Associate Project Manager",
      issuer: "IBM",
      category: "Project Management",
      year: "2023"
    },
    {
      name: "Registered Scrum Master",
      issuer: "Scrum Inc.",
      category: "Agile/Scrum",
      year: "2021"
    },
    {
      name: "IBM watsonx.ai Technical Sales Advanced",
      issuer: "IBM",
      category: "AI",
      year: "2024"
    },
    {
      name: "Gen AI Architect - Experienced Badge",
      issuer: "IBM",
      category: "AI",
      year: "2024"
    },
    {
      name: "IBM Champion Learner Gold",
      issuer: "IBM",
      category: "Learning",
      recurring: "Every year",
      description: "Awarded yearly with 800+ hours of learning"
    }
  ],

  // ==================== RICONOSCIMENTI E PREMI ====================
  awards: [
    {
      title: "IBM Top Contributor 2023",
      year: "2023",
      description: "Awarded as top contributor at IBM among the whole technical community. Invited to IBM Tech 2023 in Dubai with best 500 people worldwide.",
      significance: "Selected from thousands of IBM employees globally"
    },
    {
      title: "IBM Champion Learner Gold",
      recurring: "Yearly (2020-2025)",
      description: "Awarded every year for 800+ hours of learning and multiple certifications",
      stats: "Average 600 learning hours and 35-45 digital credentials per year"
    },
    {
      title: "IBM Blue Core Teacher/Mentor",
      recurring: "Yearly recognition",
      description: "Recognized for teaching, coaching, and mentoring activities"
    },
    {
      title: "IBM Inventor Recognition",
      year: "2024-2025",
      description: "Recognized for patent filings and research publications in Generative AI"
    },
    {
      title: "75 Anni di IBM a Napoli - Speaker",
      year: "2023",
      event: "IBM 75th Anniversary in Naples",
      description: "Represented IBM at prestigious event with CEO and public administration representatives (Governor, Mayor) at 'Città della Scienza'",
      role: "Spoke about personal experiences and growth opportunities at IBM"
    }
  ],

  // ==================== TEACHING & MENTORING ====================
  teachingExperience: {
    internal: [
      {
        role: "SAP Academy Teacher",
        period: "2022-Current",
        topics: ["Agile", "Design Thinking", "Scrum"],
        audience: "New hires at IBM"
      },
      {
        role: "Team Leader / Mentor",
        period: "2022-Current",
        activities: [
          "Daily and weekly teaching sessions",
          "Hard skills: technical and functional training",
          "Soft skills: client management, prioritization, process optimization",
          "Methodologies: Agile, Scrum",
          "Tools: Monday, Trello, OneNote"
        ]
      },
      {
        role: "IBM Blue Core Teacher/Mentor",
        recurring: "Yearly recognition",
        description: "Teaching and mentoring younger colleagues to become future teachers"
      },
      {
        role: "AskMeAnything Sessions Host",
        period: "2023-Current",
        description: "Led global AskMeAnything meetings for new IBM hires worldwide",
        topics: ["Career growth", "Opportunities at IBM", "Professional development"]
      }
    ],
    external: [
      {
        role: "Company Tutor",
        description: "Acted as company tutor for college students during internships and stages"
      }
    ],
    philosophy: "Focus on transferring good work approaches and enabling team members to teach others"
  },

  // ==================== MANAGEMENT EXPERIENCE ====================
  managementExperience: {
    current: {
      role: "People Manager",
      since: "2025",
      teamSize: 10,
      description: "Managing 10 people as of September 2025"
    },
    
    history: [
      {
        role: "Team Lead",
        period: "2022-2024",
        teamSize: "3-6 people",
        responsibilities: [
          "Technical leadership across SAP SRM, EHS modules",
          "Team growth and development",
          "Resource allocation and planning",
          "Performance management"
        ]
      },
      {
        role: "Scrum Master",
        period: "2020-2021",
        teamSize: 6,
        context: "IBM Induction Experience",
        achievement: "Led six-person agile team in high-pressure environment"
      },
      {
        role: "Associate Project Manager",
        period: "2021-2023",
        projects: [
          "Mobile Application Development (6 months)",
          "SAP PI to PO Migration (1 year)"
        ]
      }
    ],

    approach: [
      "Emphasis on clarity, trust, and adaptability",
      "Open and effective communication across all organizational levels",
      "Balance strategic vision with operational execution",
      "Enable teams to meet business demands while exceeding expectations"
    ]
  },

  // ==================== LINGUE ====================
  languages: [
    {
      language: "Italian",
      level: "Mother Tongue",
      proficiency: "Native"
    },
    {
      language: "English",
      level: "Fluent",
      certifications: ["Trinity Grade 9", "British Institutes Grade B2.2"],
      usage: "Professional working proficiency, international client management"
    }
  ],

  // ==================== INDUSTRIE ====================
  industries: [
    "Energy, Environment & Utilities",
    "Banking (International)",
    "Retail (International)",
    "Lottery (International)",
    "Environment Health Safety Management"
  ],

  // ==================== APPROCCIO PROFESSIONALE ====================
  professionalApproach: {
    mainDriver: "Curiosity and Lifelong Learning",
    philosophy: [
      "Problem solving (technical and functional)",
      "People coordination and knowledge transmission",
      "Role as educators shaping colleagues",
      "Focus on personal, company, and client growth"
    ],
    
    learningStats: {
      averageYearlyHours: 600,
      averageYearlyCertifications: "35-45 digital credentials",
      trackRecord: "Proven expertise through hands-on experiences and feedback"
    },

    workStyle: [
      "Proactive and client-centric",
      "Agility in managing high-pressure situations",
      "Prioritization of deliverables",
      "Adaptive communication strategies",
      "Trust, transparency, and commitment to excellence"
    ]
  },

  // ==================== CONTESTO CONSULTING ====================
  consultingContext: `
As of September 2025, I have extensive experience across a wide variety of digital contexts:

JOURNEY OVERVIEW:
- Started as SAP SRM Consultant (2020) on twin Energy & Utilities projects
- Within 6 months: managing both AMS and Enhancements independently
- Year 2 (2021-2022): SAP S/4 HANA Developer on international Retail greenfield project
- Year 3 (2022): Returned as Team Lead managing 3+ resources, grew team significantly
- Developed Architect role: leading client meetings, requirements gathering, gap analysis, feasibility assessments
- Led SAP SRM to Fiori transformation: complete portfolio of Fiori Apps
- Year 4 (2023): SAP EHS Team Leader, recognized by client as trusted advisors
- Part-time Associate Project Manager on 2 projects (including SAP PI to PO migration)
- Year 5 (2024-Current): SAP Ariba Consultant specializing in end-to-end procurement solutions
- Year 6 (2025-Current): Sales Solution Advisor supporting technical solutioning

CAPABILITIES:
- ABAP development, process customizing, integration interfaces
- Unit testing, integration testing, UATs
- Stakeholder management across technical teams, business, and C-level
- Managing competing priorities and critical issues
- Building long-lasting relationships based on trust and transparency
`,

  // ==================== SPECIALIZZAZIONI ====================
  specializations: [
    "SAP Ariba (Sourcing, Procurement, SLP, Contract Management)",
    "SAP SRM (Supplier Relationship Management)",
    "SAP S/4HANA Development",
    "SAP Fiori/UI5 Development",
    "SAP EHS (Environment, Health & Safety)",
    "Solution Architecture",
    "Generative AI Integration",
    "Digital Transformation",
    "Cloud Architecture",
    "Mobile Development (Flutter)",
    "Team Leadership & People Management",
    "Project Management",
    "Agile/Scrum Methodologies"
  ],

  // ==================== INTERESSI ====================
  interests: [
    "Lifelong learning and continuous education",
    "Teaching and mentoring",
    "Innovation and research (patents, publications)",
    "Generative AI and emerging technologies",
    "Solution architecture",
    "Public speaking and knowledge sharing"
  ]
};

// Helper function per ottenere context completo come stringa
export function getFullContext() {
  return JSON.stringify(askMeContext, null, 2);
}

// Helper function per ottenere summary conciso
export function getContextSummary() {
  return `
Name: ${askMeContext.personalInfo.fullName}
Current Role: ${askMeContext.personalInfo.currentPosition}
Location: ${askMeContext.personalInfo.location}

Experience: ${askMeContext.workExperience.length} positions at IBM (2020-Current)
Education: Master's and Bachelor's in Electronic Engineering from Università Federico II, Naples

Key Expertise:
- SAP: Ariba (80%), SRM (75%), S/4HANA (70%), Fiori/BTP (65%), EHS (75%)
- Architecture: Solution Architect, Application Architect (85%)
- AI: Generative AI (75%), IBM watsonx.ai certified
- Leadership: Team Lead, People Manager (10 people), Scrum Master certified
- Programming: ABAP (90%), JavaScript (85%), Dart/Flutter (70%)

Notable Achievements:
- Published SAP Press author (Catalog Management with SAP Ariba Catalog, Aug 2025)
- 1 Patent filed (Gen AI for impaired people support)
- 1 Research publication (Gen AI for HR)
- IBM Top Contributor 2023 (invited to IBM Tech Dubai)
- IBM Champion Learner Gold (yearly, 600-800h learning/year)
- Speaker at IBM 75th Anniversary in Naples

Industries: Energy & Utilities, Banking, Retail, Lottery (international experience)
Languages: Italian (native), English (fluent - Trinity Grade 9, B2.2)
`;
}

export default askMeContext;
