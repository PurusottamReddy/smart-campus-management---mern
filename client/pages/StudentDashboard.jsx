
import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissionFile, setSubmissionFile] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch courses
  useEffect(() => {
    fetch("http://localhost:5000/api/students/courses", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setCourses)
      .catch(err => console.error(err));
  }, [token]);

  // Fetch assignments and notes for all enrolled courses
  useEffect(() => {
    fetch(`http://localhost:5000/api/students/assignments`, {
      headers: { Authorization: "Bearer " + token }
    }).then(res => res.json()).then(setAssignments);

    fetch(`http://localhost:5000/api/students/notes`, {
      headers: { Authorization: "Bearer " + token }
    }).then(res => res.json()).then(setNotes);
  }, [token]);

  // Load course details
  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);

    fetch(`http://localhost:5000/api/students/attendance/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    }).then(res => res.json()).then(setAttendance);

    fetch(`http://localhost:5000/api/students/grades/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    }).then(res => res.json()).then(setGrades);

    fetch(`http://localhost:5000/api/students/timetable/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    }).then(res => res.json()).then(setTimetable);

    // Fetch notes and assignments for the selected course only
    fetch(`http://localhost:5000/api/students/notes/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    }).then(res => res.json()).then(setNotes);

    fetch(`http://localhost:5000/api/students/assignments/${courseId}`, {
      headers: { Authorization: "Bearer " + token }
    }).then(res => res.json()).then(setAssignments);
  };

  // Submit Assignment
  const submitAssignment = async (assignmentId) => {
    if (!submissionFile) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", submissionFile);

    const res = await fetch(`http://localhost:5000/api/students/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });
    const data = await res.json();
    alert(data.msg);
  };

  return (
    <div className="container">
      <h1 className="page-title">🎓 Student Dashboard</h1>

      <h2 className="section-title">My Courses</h2>
      <div className="card">
        <ul className="list">
          {courses.map(c => (
            <li key={c._id}>
              <button className="btn" onClick={() => handleSelectCourse(c._id)}>
                {c.name} ({c.code})
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedCourse && (
        <div className="grid grid-3">
          <div className="card">
            <h3 className="section-title">📌 Attendance</h3>
            <ul className="list">{attendance.map(a => <li key={a._id}>{new Date(a.date).toDateString()} - {a.status}</li>)}</ul>
          </div>
          <div className="card">
            <h3 className="section-title">📌 Grades</h3>
            <ul className="list">{grades.map(g => <li key={g._id}>{g.marks}/{g.maxMarks}</li>)}</ul>
          </div>
          <div className="card">
            <h3 className="section-title">📌 Timetable</h3>
            <ul className="list">{timetable.map(t => <li key={t._id}>{t.day} {t.startTime}-{t.endTime}: {t.subject}</li>)}</ul>
          </div>
        </div>
      )}

      {selectedCourse && (
        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div className="card">
            <h3 className="section-title">📝 Notes</h3>
            <ul className="list">
              {notes.map(n => (
                <li key={n._id}>
                  {n.title} — <a href={`http://localhost:5000${n.fileUrl}`} target="_blank">View</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className="section-title">📚 Assignments</h3>
            <ul className="list">
              {assignments.map(a => (
                <li key={a._id}>
                  {a.title} (Due: {a.dueDate ? new Date(a.dueDate).toDateString() : '-'}) — 
                  <a href={`http://localhost:5000${a.fileUrl}`} target="_blank">Question</a>
                  <div className="inline-controls" style={{ marginTop: 8 }}>
                    <input className="input" type="file" onChange={(e) => setSubmissionFile(e.target.files[0])} />
                    <button className="btn" onClick={() => submitAssignment(a._id)}>Submit</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
