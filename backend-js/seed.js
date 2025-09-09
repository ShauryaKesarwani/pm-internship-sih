const mongoose = require("mongoose");
const User = require("./Model/User"); // path to your userSchema file

mongoose.connect("mongodb://127.0.0.1:27017/don-tByteMe")
  .then(async () => {
    console.log("MongoDB connected");

    // Sample users
    const users = [
      {
        auth0Id: "auth0|123456",
        username: "asha_dev",
        name: "Asha Verma",
        gender: "Female",
        email: "asha@example.com",
        password: "hashed_password_here",
        avatar: "https://example.com/avatar1.png",
        field: "Tech",
        phoneNumber: "9876543210",
        residence: {
          pin: 110001,
          city: "Delhi",
          state: "Delhi"
        },
        experience: {
          internships: [
            {
              title: "Frontend Intern",
              company: "StartupX",
              duration: "3 months",
              description: "Worked on React components for dashboard."
            }
          ]
        },
        resume: {
          skills: ["JavaScript", "React", "Node.js", "Python"],
          projects: [],  // will reference Project collection
          certifications: ["AWS Cloud Practitioner"],
          socialLinks: ["https://github.com/asha-dev"],
          docResume: {}
        },
        internships: {
          applications: [],
          pastInternships: [],
          currentInternship: null
        }
      },
      {
        auth0Id: "auth0|654321",
        username: "raj_ml",
        name: "Raj Patel",
        gender: "Male",
        email: "raj@example.com",
        password: "hashed_password_here",
        avatar: "https://example.com/avatar2.png",
        field: "Tech",
        phoneNumber: "9876501234",
        residence: {
          pin: 400001,
          city: "Mumbai",
          state: "Maharashtra"
        },
        experience: {
          internships: [
            {
              title: "Data Analyst Intern",
              company: "DataWorks",
              duration: "6 months",
              description: "Analyzed datasets and built visualization dashboards."
            }
          ]
        },
        resume: {
          skills: ["Python", "Pandas", "Machine Learning", "NLP"],
          projects: [],
          certifications: ["Coursera ML Specialization"],
          socialLinks: ["https://linkedin.com/in/raj-ml"],
          docResume: {}
        },
        internships: {
          applications: [],
          pastInternships: [],
          currentInternship: null
        }
      }
    ];

    await User.insertMany(users);
    console.log("Sample users inserted");
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
