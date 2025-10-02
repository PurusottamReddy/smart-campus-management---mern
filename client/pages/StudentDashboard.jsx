import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const token = localStorage.getItem("token"); // after login

  // Fetch student’s courses
  useEffect(() => {
    fetch("http://localhost:5000/api/students/courses", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setCourses)
      .catch(err => console.error(err));
  }, [token]);

  // When a course is selected, fetch details
  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);

    fetch(`http://localhost:5000/api/students/attendance/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setAttendance);

    fetch(`http://localhost:5000/api/students/grades/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setGrades);

    fetch(`http://localhost:5000/api/students/timetable/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setTimetable);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎓 Student Dashboard</h1>

      <h2>My Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c._id}>
            <button onClick={() => handleSelectCourse(c._id)}>
              {c.name} ({c.code}) - {c.faculty?.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedCourse && (
        <div>
          <h3>📌 Attendance</h3>
          <ul>
            {attendance.map(a => (
              <li key={a._id}>{new Date(a.date).toDateString()} - {a.status}</li>
            ))}
          </ul>

          <h3>📌 Grades</h3>
          <ul>
            {grades.map(g => (
              <li key={g._id}>{g.marks}/{g.maxMarks}</li>
            ))}
          </ul>

          <h3>📌 Timetable</h3>
          <ul>
            {timetable.map(t => (
              <li key={t._id}>{t.day} {t.startTime}-{t.endTime}: {t.subject}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
