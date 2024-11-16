// CV Content Data Structure
export default {
    // Header section for the main profile information
    header: {
        name: "Jim Cresswell", // Full name
        title: "Principal Engineer", // Professional title
        email: "jim@jimcresswell.net", // Contact email
        linkedin: "https://linkedin.com/in/jimcresswell", // LinkedIn profile link
    },

    // Introductory Summary
    summary: [
        "Jim Cresswell is a Principal Engineer with a focus on sustainable development, high-quality digital products, and impactful solutions. Recognised for his strategic thinking and practical approach, he brings strengths in defining and leading technical strategies, coaching teams, and balancing organisational needs with technical excellence. Jim’s approach centres on collaboration, empowering teams to deliver their best work, and fostering a low-stress environment that not only enhances product quality and release cadence but also builds collaborative and effective teams.",
        "As the principal engineer for the national education platform Oak National Academy, Jim has directed technical strategy, influenced organisational culture, and led significant product rebuilds, working closely with product, business, and leadership teams. His passions include ecological and social impact, open-source software, and building resilient, high-quality services. His problem-solving and decision-making is research-driven and forward-looking, with a focus on prototyping and sustainable, long-term solutions."
    ],

    // Experience section listing previous roles and responsibilities
    experiences: [
        {
            position: "Head of DevOps and Quality (Consulting)", // Job title
            company: "Oak (remote)", // Company name and location if applicable
            dates: "January 2021 - Present", // Duration of employment
            description: [ // List of key responsibilities and achievements
                "Led CI/CD, testing strategy, and developer experience for Oak National Academy's remote edtech apps.",
                "Collaborated with cloud service providers including Google Cloud Services, Cloudflare, GitHub, Vercel, BrowserStack, and SonarCloud."
            ],
        },
        {
            position: "Senior Developer (Consulting)", // Job title
            company: "Oak (remote)", // Company name and location if applicable
            dates: "August 2020 - December 2020", // Duration of employment
            description: [ // List of key responsibilities and achievements
                "Helped develop the Oak National Academy remote edtech apps from an early stage.",
                "Worked with React, Next.js, GraphQL, and a variety of cloud data and service providers.",
                "Drove improvements on code quality, CI, automated testing, and engineering best practices."
            ],
        },
        {
            position: "Head of Test (Consulting)", // Job title
            company: "Medicspot (remote)", // Company name and location if applicable
            dates: "April 2020 - July 2020", // Duration of employment
            description: [ // List of key responsibilities and achievements
                "Led test automation and quality assurance strategy and process for a telemedicine technology start-up.",
                "Created full-stack automated test solutions in CI for a suite of Express and React apps (JavaScript, Node, React, Express, Postgres).",
                "Drove quality as a culture adoption through education and engagement, in an agile and high-velocity team."
            ],
        },
        {
            position: "Founder",
            company: "Obaith",
            dates: "January 2018 - December 2020",
            description: [
                "Led a tech for good project focused on exploring how digital services can support climate breakdown, biodiversity, and social connection through community projects.",
                "Conducted full-time research on system change, leverage points, and scalable solutions to support positive change.",
                "Built networks and gathered information to support future projects."
            ],
        },
        {
            position: "Programme QA Consultant",
            company: "The Home Office (part-remote)",
            dates: "February 2017 - December 2017",
            description: [
                "Led QA automation strategy across an agile programme of 2 projects and 6 scrum teams creating a micro-service architecture public-facing web service.",
                "Created and coached teams on human-readable, automatically validated product specifications using Cucumber, JavaScript, Java, and Webdriver.",
                "Coordinated with architects, programme leads, analysts, and technical leads to ensure comprehensive automated validation and rapid feedback."
            ],
        },
        {
            position: "Senior Developer",
            company: "FT Labs (Financial Times)",
            dates: "August 2011 - July 2014",
            description: [
                "Joined FT Labs during its transition from startup Assanka to the Financial Times, working as a web developer on the award-winning cross-platform HTML5 FT web app.",
                "Led QA automation and strategy, introducing end-to-end testing using WebDriver (Java) and Jenkins, with a focus on continuous integration and delivery velocity.",
                "Took technical lead on the FT Windows 8 app and contributed to experimental projects, including the FT FirefoxOS app."
            ],
        },
        {
            position: "QA Automation Consultant",
            company: "British Airways (part-remote)",
            dates: "March 2015 - December 2015",
            description: [
                "Provided education and training on Specification by Example (BDD) and unit/integration testing approaches (TDD).",
                "Supported long-term strategies around continuous testing and delivery, including adoption of cloud technologies and incremental migration to microservices architecture.",
                "Drove awareness and adoption of software delivery best practices among executive, design, and development teams through planning, presentations, and digital communication."
            ],
        },
        {
            position: "Systems Engineer",
            company: "Hewlett-Packard Laboratories for N-able",
            dates: "April 2009 - November 2010",
            description: [
                "Carried out software and hardware test plan design and execution for an HP storage product.",
                "Organised manual efforts into a team effort to create a test automation framework in Perl, which was used internally by HP for several years."
            ],
        },
        {
            position: "PhD Researcher",
            company: "Institute for Cosmology and Gravitation, University of Portsmouth",
            dates: "September 2005 - December 2010",
            description: [
                "Planned and carried out research projects at the Institute for Cosmology and Gravitation, developing mathematical models and computational pipelines.",
                "Applied models to large astrophysical data sets using data from the Galaxy Zoo citizen science project.",
                "Used model fitting algorithms and data visualisation techniques in C, Matlab, and SQL.",
                "Authored several publications, including thesis: 'Luminosity Functions and Galaxy Bias in the Sloan Digital Sky Survey'."
            ],
        }
    ],

    // Education section listing academic achievements
    education: [
        {
            school: "University of Portsmouth", // Name of institution
            degree: "PhD in Cosmology and Gravitation", // Degree obtained
            dates: "September 2005 - December 2010", // Duration of study
            thesis: "Luminosity Functions and Galaxy Bias in the Sloan Digital Sky Survey" // Thesis title
        },
        {
            school: "Sussex University", // Name of institution
            degree: "Master of Science (M.Sc.), Cosmology", // Degree obtained
            dates: "2004 - 2005", // Duration of study
            thesis: "Observing Cosmological Topology" // Thesis title
        },
        {
            school: "University of Bath", // Name of institution
            degree: "Master of Physics (M.Phys.), Physics", // Degree obtained
            dates: "1998 - 2002", // Duration of study
            thesis: "The Design and Construction of a Theremin" // Thesis title
        }
    ],

    // Skills section listing core competencies and technical skills
    skills: [
        "JavaScript", "React", "Node.js", "CI/CD", "Automation", "DevOps",
        "Cloud Computing", "Testing Strategy", "BDD", "TDD", "System Architecture",
        "Microservices", "Quality Assurance", "Leadership", "GraphQL", "Next.js",
        "Agile Methodologies", "Prototyping", "Sustainable Development"
    ],

    // Interests section listing personal interests
    interests: [
        "Putting regenerative processes at the heart of daily life through systems thinking and theories of change.",
        "Exploring ecological solutions to global problems, community networks, and cradle-to-cradle design.",
        "Volunteering as a market gardener with the organic local-food movement Growing Communities.",
        "Running as a councillor in the 2018 UK local elections and considering future campaigns on local issues.",
        "Data visualisation, creating meaningful insights from data, and developing interactive applications."
    ],

    // Contact message for footer or additional outreach information
    contactMessage: "Feel free to reach out via email for consultancy, automation, or development work."
}
