const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
require('dotenv').config();

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    // Create faculty users
    const faculty1 = await User.create({
      name: 'Dr. Smith',
      email: 'smith@university.edu',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // password
      role: 'faculty',
      department: 'Computer Science'
    });

    const faculty2 = await User.create({
      name: 'Prof. Johnson',
      email: 'johnson@university.edu',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // password
      role: 'faculty',
      department: 'Mathematics'
    });

    // Create student users
    const student1 = await User.create({
      name: 'Alice Cooper',
      email: 'alice@student.edu',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // password
      role: 'student',
      department: 'Computer Science'
    });

    const student2 = await User.create({
      name: 'Bob Wilson',
      email: 'bob@student.edu',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // password
      role: 'student',
      department: 'Computer Science'
    });

    const student3 = await User.create({
      name: 'Carol Davis',
      email: 'carol@student.edu',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', // password
      role: 'student',
      department: 'Mathematics'
    });

    console.log('Created users');

    // Create courses for faculty 1 (Computer Science)
    const course1 = await Course.create({
      name: 'Introduction to Computer Science',
      code: 'CS101',
      faculty: faculty1._id,
      students: [student1._id, student2._id]
    });

    const course2 = await Course.create({
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      faculty: faculty1._id,
      students: [student1._id, student2._id]
    });

    // Create courses for faculty 2 (Mathematics)
    const course3 = await Course.create({
      name: 'Calculus I',
      code: 'MATH101',
      faculty: faculty2._id,
      students: [student3._id]
    });

    const course4 = await Course.create({
      name: 'Linear Algebra',
      code: 'MATH201',
      faculty: faculty2._id,
      students: [student3._id]
    });

    console.log('Created courses');

    // Update user courses arrays
    await User.findByIdAndUpdate(faculty1._id, { courses: [course1._id, course2._id] });
    await User.findByIdAndUpdate(faculty2._id, { courses: [course3._id, course4._id] });
    await User.findByIdAndUpdate(student1._id, { courses: [course1._id, course2._id] });
    await User.findByIdAndUpdate(student2._id, { courses: [course1._id, course2._id] });
    await User.findByIdAndUpdate(student3._id, { courses: [course3._id, course4._id] });

    console.log('Updated user course references');

    console.log('Sample data created successfully!');
    console.log('\nFaculty Login Credentials:');
    console.log('Faculty 1: smith@university.edu / password');
    console.log('Faculty 2: johnson@university.edu / password');
    console.log('\nStudent Login Credentials:');
    console.log('Student 1: alice@student.edu / password');
    console.log('Student 2: bob@student.edu / password');
    console.log('Student 3: carol@student.edu / password');

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
}

seedData();
