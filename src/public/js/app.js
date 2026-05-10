// ==================== API CONFIGURATION ====================
const API_BASE_URL = 'http://localhost:3000/api';
const STUDENTS_ENDPOINT = `${API_BASE_URL}/students`;

// ==================== DOM ELEMENTS ====================
const studentForm = document.getElementById('studentForm');
const editForm = document.getElementById('editForm');
const studentsList = document.getElementById('studentsList');
const studentsCards = document.getElementById('studentsCards');
const messageContainer = document.getElementById('messageContainer');
const searchBox = document.getElementById('searchBox');
const studentCount = document.getElementById('studentCount');
const submitBtn = document.getElementById('submitBtn');

// Modal elements
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const closeModalBtn = document.getElementById('closeModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeButtons = document.querySelectorAll('.close');

// Store all students
let allStudents = [];
let currentEditId = null;
let currentDeleteId = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    attachEventListeners();
});

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    // Form submission
    studentForm.addEventListener('submit', handleAddStudent);
    editForm.addEventListener('submit', handleEditStudent);

    // Search functionality
    searchBox.addEventListener('keyup', filterStudents);

    // Modal controls
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', confirmDelete);

    // Close modal when clicking X
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// ==================== LOAD STUDENTS ====================
async function loadStudents() {
    try {
        const response = await fetch(STUDENTS_ENDPOINT);
        const result = await response.json();

        if (result.success) {
            allStudents = result.data;
            displayStudents(allStudents);
            updateStudentCount();
        } else {
            showMessage('Failed to load students', 'error');
        }
    } catch (error) {
        console.error('Error loading students:', error);
        showMessage('Error connecting to server', 'error');
    }
}

// ==================== DISPLAY STUDENTS ====================
function displayStudents(students) {
    // Clear previous content
    studentsList.innerHTML = '';
    studentsCards.innerHTML = '';

    if (students.length === 0) {
        studentsList.innerHTML = '<tr class="empty-row"><td colspan="6">No students found. Add one to get started!</td></tr>';
        return;
    }

    // Display table rows
    students.forEach(student => {
        const row = createTableRow(student);
        studentsList.appendChild(row);
    });

    // Display cards (for mobile)
    students.forEach(student => {
        const card = createStudentCard(student);
        studentsCards.appendChild(card);
    });
}

// ==================== CREATE TABLE ROW ====================
function createTableRow(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.roll}</td>
        <td>${student.course}</td>
        <td>
            <button class="btn-edit" onclick="openEditModal(${student.id})">✏️ Edit</button>
            <button class="btn-delete" onclick="openDeleteModal(${student.id})">🗑️ Delete</button>
        </td>
    `;
    return row;
}

// ==================== CREATE STUDENT CARD ====================
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
        <h3>${student.name}</h3>
        <p><span class="label">Roll No:</span> ${student.roll}</p>
        <p><span class="label">Email:</span> ${student.email}</p>
        <p><span class="label">Course:</span> ${student.course}</p>
        <div class="actions">
            <button class="btn btn-primary btn-small" onclick="openEditModal(${student.id})">✏️ Edit</button>
            <button class="btn btn-danger btn-small" onclick="openDeleteModal(${student.id})">🗑️ Delete</button>
        </div>
    `;
    return card;
}

// ==================== ADD STUDENT ====================
async function handleAddStudent(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        roll: document.getElementById('roll').value.trim(),
        course: document.getElementById('course').value
    };

    // Validation
    if (!formData.name || !formData.email || !formData.roll || !formData.course) {
        showMessage('All fields are required', 'error');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Adding...';

        const response = await fetch(STUDENTS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            allStudents.push(result.data);
            displayStudents(allStudents);
            updateStudentCount();
            studentForm.reset();
            showMessage('✅ Student added successfully!', 'success');
            searchBox.value = '';
        } else {
            showMessage(result.message || 'Failed to add student', 'error');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        showMessage('Error adding student', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '➕ Add Student';
    }
}

// ==================== OPEN EDIT MODAL ====================
function openEditModal(id) {
    const student = allStudents.find(s => s.id === id);
    if (!student) return;

    currentEditId = id;
    document.getElementById('editId').value = student.id;
    document.getElementById('editName').value = student.name;
    document.getElementById('editEmail').value = student.email;
    document.getElementById('editRoll').value = student.roll;
    document.getElementById('editCourse').value = student.course;

    editModal.classList.add('active');
}

// ==================== CLOSE EDIT MODAL ====================
function closeEditModal() {
    editModal.classList.remove('active');
    editForm.reset();
    currentEditId = null;
}

// ==================== EDIT STUDENT ====================
async function handleEditStudent(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('editId').value);
    const formData = {
        name: document.getElementById('editName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        roll: document.getElementById('editRoll').value.trim(),
        course: document.getElementById('editCourse').value
    };

    if (!formData.name || !formData.email || !formData.roll || !formData.course) {
        showMessage('All fields are required', 'error');
        return;
    }

    try {
        const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            const index = allStudents.findIndex(s => s.id === id);
            allStudents[index] = result.data;
            displayStudents(allStudents);
            updateStudentCount();
            closeEditModal();
            showMessage('✅ Student updated successfully!', 'success');
            searchBox.value = '';
        } else {
            showMessage(result.message || 'Failed to update student', 'error');
        }
    } catch (error) {
        console.error('Error updating student:', error);
        showMessage('Error updating student', 'error');
    }
}

// ==================== OPEN DELETE MODAL ====================
function openDeleteModal(id) {
    currentDeleteId = id;
    deleteModal.classList.add('active');
}

// ==================== CLOSE DELETE MODAL ====================
function closeDeleteModal() {
    deleteModal.classList.remove('active');
    currentDeleteId = null;
}

// ==================== DELETE STUDENT ====================
async function confirmDelete() {
    if (!currentDeleteId) return;

    try {
        const response = await fetch(`${STUDENTS_ENDPOINT}/${currentDeleteId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            allStudents = allStudents.filter(s => s.id !== currentDeleteId);
            displayStudents(allStudents);
            updateStudentCount();
            closeDeleteModal();
            showMessage('✅ Student deleted successfully!', 'success');
            searchBox.value = '';
        } else {
            showMessage(result.message || 'Failed to delete student', 'error');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showMessage('Error deleting student', 'error');
    }
}

// ==================== FILTER STUDENTS (SEARCH) ====================
function filterStudents() {
    const searchTerm = searchBox.value.toLowerCase().trim();

    if (searchTerm === '') {
        displayStudents(allStudents);
        return;
    }

    const filtered = allStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.roll.toLowerCase().includes(searchTerm)
    );

    displayStudents(filtered);
    updateStudentCount();
}

// ==================== SHOW MESSAGE ====================
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageDiv);

    // Auto-remove message after 4 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

// ==================== UPDATE STUDENT COUNT ====================
function updateStudentCount() {
    const count = allStudents.length;
    const countText = count === 1 ? '1 student' : `${count} students`;
    studentCount.textContent = countText;
}
