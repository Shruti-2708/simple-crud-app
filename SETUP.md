# ⚡ Quick Start Guide

## 30 Seconds Setup

### Prerequisites Check
```bash
node --version  # Should be v14 or higher
npm --version   # Should show version
```

### Installation
```bash
# Navigate to project folder
cd simple-crud-app

# Install dependencies
npm install

# Run the application
npm run dev
```

### Open in Browser
```
http://localhost:3000
```

That's it! 🎉

---

## What You Should See

- **Header**: "📚 Student Management System"
- **Left Side**: Add Student Form
- **Right Side**: Student Records Table
- **Search Box**: For filtering students
- **Buttons**: Edit ✏️ and Delete 🗑️ buttons for each student

---

## Test the CRUD Operations

### 1. CREATE - Add a Student
1. Fill in the form with:
   - Name: "Test Student"
   - Email: "test@example.com"
   - Roll: "999"
   - Course: "B.Tech"
2. Click "➕ Add Student"
3. See success message and new student in table

### 2. READ - View Students
- Open http://localhost:3000
- See all students displayed in table
- Scroll or search to find them

### 3. UPDATE - Edit a Student
1. Click ✏️ Edit button on any student
2. Modify any field
3. Click "💾 Save Changes"
4. See updated data in table

### 4. DELETE - Remove a Student
1. Click 🗑️ Delete button
2. Confirm deletion in popup
3. Student is removed from table

### 5. SEARCH - Find Students
1. Type name, email, or roll number in search box
2. Table updates in real-time
3. Clear search to see all students

---

## Commands Reference

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start

# Stop server
Ctrl + C

# List all installed packages
npm list

# Update a package
npm update express
```

---

## File Locations

```
📁 simple-crud-app/
├── 📄 package.json          ← Dependencies
├── 📄 README.md             ← Full documentation
├── 📄 SETUP.md              ← This file
├── 📄 .gitignore            ← Git ignore rules
└── 📁 src/
    ├── 📄 server.js         ← Backend API
    └── 📁 public/
        ├── 📄 index.html    ← Webpage
        ├── 📁 css/
        │   └── 📄 style.css ← Styling
        └── 📁 js/
            └── 📄 app.js    ← Frontend logic
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

---

## Troubleshooting

### Port 3000 Already in Use?
```bash
# Kill process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process using port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Modules Not Installing?
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Page Shows Blank?
1. Check browser console: F12 → Console
2. Check server logs: Look at terminal
3. Restart server: Ctrl+C and `npm run dev`

---

## Next Steps

✅ Get the app running
✅ Test all CRUD operations
✅ Read README.md for detailed explanation
✅ Explore the code files
✅ Make modifications and test
✅ Push to GitHub!

---

## GitHub Setup

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Simple CRUD app"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/simple-crud-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

**You're all set! Happy coding! 🚀**
