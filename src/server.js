const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// In-memory database (simulating database with array)
let students = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    roll: "001",
    course: "B.Tech",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    roll: "002",
    course: "B.Tech",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    roll: "003",
    course: "BCA",
  },
];

let nextId = 4;

// API ROUTES

// 1. READ - Get all students
app.get("/api/students", (req, res) => {
  res.json({
    success: true,
    data: students,
    message: "Students retrieved successfully",
  });
});

// 2. READ - Get single student by ID
app.get("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id === parseInt(req.params.id));

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  res.json({
    success: true,
    data: student,
    message: "Student retrieved successfully",
  });
});

// 3. CREATE - Add new student
app.post("/api/students", (req, res) => {
  const { name, email, roll, course } = req.body;

  // Validation
  if (!name || !email || !roll || !course) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: name, email, roll, course",
    });
  }

  // Check if email already exists
  if (students.some((s) => s.email === email)) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const newStudent = {
    id: nextId++,
    name,
    email,
    roll,
    course,
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    data: newStudent,
    message: "Student created successfully",
  });
});

// 4. UPDATE - Modify existing student
app.put("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id === parseInt(req.params.id));

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  const { name, email, roll, course } = req.body;

  // Validation
  if (!name || !email || !roll || !course) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: name, email, roll, course",
    });
  }

  // Check if email already exists (excluding current student)
  if (email !== student.email && students.some((s) => s.email === email)) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  // Update student
  student.name = name;
  student.email = email;
  student.roll = roll;
  student.course = course;

  res.json({
    success: true,
    data: student,
    message: "Student updated successfully",
  });
});

// 5. DELETE - Remove student
app.delete("/api/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  const deletedStudent = students.splice(index, 1);

  res.json({
    success: true,
    data: deletedStudent[0],
    message: "Student deleted successfully",
  });
});

// WELCOME ROUTE

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation:`);
  console.log(`  GET    /api/students          - Get all students`);
  console.log(`  GET    /api/students/:id      - Get single student`);
  console.log(`  POST   /api/students          - Create new student`);
  console.log(`  PUT    /api/students/:id      - Update student`);
  console.log(`  DELETE /api/students/:id      - Delete student`);
});
