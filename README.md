# MIS321-Project2

## Educational Minigames Platform

A full-stack web application for educational minigames with class-based student management.

### Features

- **Class-Based System**: Teachers get unique 8-digit Class IDs for student enrollment
- **Student Registration**: Students join classes using their teacher's Class ID
- **Educational Minigames**: Math Challenge, Science Lab, Robot Beeper Challenge, Labyrinth of Lies, History Timeline
- **Progress Tracking**: Real-time score tracking and student progress monitoring
- **Teacher Dashboard**: Comprehensive view of class performance and individual student progress

### Technology Stack

- **Backend**: .NET 8 Web API with Entity Framework Core
- **Frontend**: HTML5, CSS3, JavaScript with Bootstrap 5.3.3
- **Database**: SQLite
- **Authentication**: BCrypt password hashing

### Quick Start

1. **Start the API**: Navigate to `API/` folder and run `dotnet run`
2. **Open Frontend**: Open `index.html` in your browser
3. **Create Teacher Account**: Register as a teacher to get your Class ID
4. **Share Class ID**: Give your 8-digit Class ID to students
5. **Student Registration**: Students register using your Class ID
6. **Monitor Progress**: View student progress in your teacher dashboard

### Class Management

- Teachers receive a unique 8-digit Class ID upon registration
- Students must enter their teacher's Class ID during registration
- Students are automatically enrolled in the teacher's class
- No manual student assignment required

### API Endpoints

- `POST /api/auth/register` - User registration (requires Class ID for students)
- `POST /api/auth/login` - User authentication
- `GET /api/profile/{userId}` - Get user profile (includes Class ID for teachers)
- `GET /api/studentprogress/teacher/{teacherId}` - Get students in teacher's class
- `PUT /api/score/{studentId}` - Update student game scores

### Database Schema

- **Teacher**: TeacherID, TeacherName, TeacherPassword, ClassID
- **Student**: StudentID, StudentName, StudentPassword
- **InClass**: StudentID, TeacherID, ClassID (enrollment tracking)
- **StudentScores**: Game scores for each student
- **StudentProgress**: Legacy assignment table (maintained for compatibility)