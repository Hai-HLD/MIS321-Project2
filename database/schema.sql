-- Educational Minigames Database Schema
-- SQLite Database for .NET Implementation

-- Student Table
CREATE TABLE IF NOT EXISTS Student (
    StudentID TEXT PRIMARY KEY,
    StudentName TEXT NOT NULL,
    StudentPassword TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Table
CREATE TABLE IF NOT EXISTS Teacher (
    TeacherID TEXT PRIMARY KEY,
    TeacherName TEXT NOT NULL,
    TeacherPassword TEXT NOT NULL,
    ClassID TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- StudentScores Table
CREATE TABLE IF NOT EXISTS StudentScores (
    StudentID TEXT PRIMARY KEY,
    Game1Score INTEGER DEFAULT 0,
    Game2Score INTEGER DEFAULT 0,
    Game3Score INTEGER DEFAULT 0,
    Game4Score INTEGER DEFAULT 0,
    Game5Score INTEGER DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

-- StudentProgress Table (Teacher-Student assignments)
CREATE TABLE IF NOT EXISTS StudentProgress (
    TeacherID TEXT NOT NULL,
    StudentID TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (TeacherID, StudentID),
    FOREIGN KEY (TeacherID) REFERENCES Teacher(TeacherID) ON DELETE CASCADE,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

-- InClass Table (Class-based student enrollment)
CREATE TABLE IF NOT EXISTS InClass (
    StudentID TEXT NOT NULL,
    TeacherID TEXT NOT NULL,
    ClassID TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (StudentID, TeacherID),
    FOREIGN KEY (TeacherID) REFERENCES Teacher(TeacherID) ON DELETE CASCADE,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

-- Optional: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_student_name ON Student(StudentName);
CREATE INDEX IF NOT EXISTS idx_teacher_name ON Teacher(TeacherName);
CREATE INDEX IF NOT EXISTS idx_teacher_classid ON Teacher(ClassID);
CREATE INDEX IF NOT EXISTS idx_studentprogress_teacher ON StudentProgress(TeacherID);
CREATE INDEX IF NOT EXISTS idx_inclass_classid ON InClass(ClassID);
CREATE INDEX IF NOT EXISTS idx_studentprogress_student ON StudentProgress(StudentID);

-- Sample data for testing (optional - remove in production)
-- INSERT INTO Student (StudentID, StudentName, StudentPassword) 
-- VALUES ('S001', 'John Doe', 'password123');

-- INSERT INTO StudentScores (StudentID, Game1Score, Game2Score, Game3Score, Game4Score, Game5Score) 
-- VALUES ('S001', 100, 85, 90, 75, 95);

-- INSERT INTO Teacher (TeacherID, TeacherName, TeacherPassword) 
-- VALUES ('T001', 'Jane Smith', 'teacher123');

