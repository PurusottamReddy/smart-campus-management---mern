import React, { useEffect, useState } from "react";

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token"); // after login

  // Fetch courses taught by faculty
  useEffect(() => {
    fetch("http://localhost:5000/api/faculty/courses", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setCourses)
      .catch(err => console.error(err));
  }, [token]);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setStudents(course.students);
  };

  // Mark attendance
  const markAttendance = (studentId, status) => {
    fetch("http://localhost:5000/api/faculty/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        courseId: selectedCourse._id,
        studentId,
        date: new Date(),
        status
      })
    })
      .then(res => res.json())
      .then(data => alert("Attendance marked: " + data.msg));
  };

  // Upload grade
  const uploadGrade = (studentId) => {
    const marks = prompt("Enter marks:");
    const maxMarks = prompt("Enter maximum marks:");

    fetch("http://localhost:5000/api/faculty/grades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        courseId: selectedCourse._id,
        studentId,
        marks,
        maxMarks
      })
    })
      .then(res => res.json())
      .then(data => alert("Grade uploaded: " + data.msg));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>👨‍🏫 Faculty Dashboard</h1>

      <h2>My Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c._id}>
            <button onClick={() => handleSelectCourse(c)}>
              {c.name} ({c.code})
            </button>
          </li>
        ))}
      </ul>

      {selectedCourse && (
        <div>
          <h3>Students in {selectedCourse.name}</h3>
          <ul>
            {students.map(s => (
              <li key={s._id}>
                {s.name} ({s.email}){" "}
                <button onClick={() => markAttendance(s._id, "Present")}>Present</button>
                <button onClick={() => markAttendance(s._id, "Absent")}>Absent</button>
                <button onClick={() => markAttendance(s._id, "Late")}>Late</button>
                <button onClick={() => uploadGrade(s._id)}>Upload Grade</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
