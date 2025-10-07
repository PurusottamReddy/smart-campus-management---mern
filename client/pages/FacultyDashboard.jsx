
import React, { useEffect, useState } from "react";

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [noteFile, setNoteFile] = useState(null);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [grades, setGrades] = useState([]);
  // New grade form state
  const [newGradeStudent, setNewGradeStudent] = useState("");
  const [newGradeMarks, setNewGradeMarks] = useState("");
  const [newGradeMax, setNewGradeMax] = useState("");

  // Inline edit states
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteEditTitle, setNoteEditTitle] = useState("");
  const [noteEditDesc, setNoteEditDesc] = useState("");

  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [assignmentEditTitle, setAssignmentEditTitle] = useState("");
  const [assignmentEditDesc, setAssignmentEditDesc] = useState("");
  const [assignmentEditDue, setAssignmentEditDue] = useState("");
  const token = localStorage.getItem("token");

  // Fetch courses
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

    // Fetch assignments (with submissions) for this course
    fetch(`http://localhost:5000/api/faculty/assignments/${course._id}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setAssignments)
      .catch(err => console.error(err));

    // Fetch notes uploaded by this faculty for this course
    fetch(`http://localhost:5000/api/faculty/notes/${course._id}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setNotes)
      .catch(err => console.error(err));

    // Fetch grades for this course
    fetch(`http://localhost:5000/api/faculty/grades/${course._id}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setGrades)
      .catch(err => console.error(err));
  };

  // Upload Note
  const uploadNote = async () => {
    if (!noteFile || !selectedCourse) return alert("Select course & file first");

    const formData = new FormData();
    formData.append("file", noteFile);
    formData.append("title", noteFile.name);
    formData.append("description", "Lecture Note");
    formData.append("courseId", selectedCourse._id);

    const res = await fetch("http://localhost:5000/api/faculty/upload-note", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });
    const data = await res.json();
    alert(data.msg || "Note uploaded");
  };

  // Upload Assignment
  const createAssignment = async () => {
    if (!assignmentFile || !selectedCourse) return alert("Select course & file first");

    const formData = new FormData();
    formData.append("file", assignmentFile);
    formData.append("title", assignmentTitle);
    formData.append("description", assignmentDesc);
    formData.append("courseId", selectedCourse._id);
    formData.append("dueDate", dueDate);

    const res = await fetch("http://localhost:5000/api/faculty/create-assignment", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });
    const data = await res.json();
    alert(data.msg || "Assignment created");
  };

  return (
    <div className="container">
      <h1 className="page-title">👨‍🏫 Faculty Dashboard</h1>

      <h2 className="section-title">My Courses</h2>
      <div className="card">
      <ul className="list">
        {courses.map(c => (
          <li key={c._id}>
            <button className="btn" onClick={() => handleSelectCourse(c)}>
              {c.name} ({c.code})
            </button>
          </li>
        ))}
      </ul>
      </div>

      {selectedCourse && (
        <div>
          <div className="card">
          <h3 className="section-title">Students in {selectedCourse.name}</h3>
          <ul className="list">
            {students.map(s => (
              <li key={s._id}>
                {s.name} ({s.email})
              </li>
            ))}
          </ul>
          </div>

          {/* Notes Section */}
          <div className="card">
          <h3 className="section-title">📝 Upload Notes</h3>
          <div className="inline-controls">
            <input className="input" type="file" onChange={(e) => setNoteFile(e.target.files[0])} />
            <button className="btn" onClick={uploadNote}>Upload Note</button>
          </div>
          </div>

          {/* Assignments Section */}
          <div className="card">
          <h3 className="section-title">📚 Create Assignment</h3>
          <div className="inline-controls">
            <input className="input" placeholder="Title" onChange={(e) => setAssignmentTitle(e.target.value)} />
            <input className="input" placeholder="Description" onChange={(e) => setAssignmentDesc(e.target.value)} />
            <input className="input" type="date" onChange={(e) => setDueDate(e.target.value)} />
            <input className="input" type="file" onChange={(e) => setAssignmentFile(e.target.files[0])} />
            <button className="btn" onClick={createAssignment}>Create Assignment</button>
          </div>
          </div>

          {/* My Notes (edit/delete) */}
          <h3>🗒️ My Notes</h3>
          {notes.length === 0 ? (
            <p style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>No notes uploaded yet.</p>
          ) : (
            <ul>
              {notes.map(n => (
                <li key={n._id} style={{ marginBottom: "10px" }}>
                  {editingNoteId === n._id ? (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <input value={noteEditTitle} onChange={e => setNoteEditTitle(e.target.value)} placeholder="Title" />
                      <input value={noteEditDesc} onChange={e => setNoteEditDesc(e.target.value)} placeholder="Description" />
                      <button onClick={async () => {
                        await fetch(`http://localhost:5000/api/faculty/notes/${n._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                          body: JSON.stringify({ title: noteEditTitle, description: noteEditDesc })
                        });
                        // refresh
                        const res = await fetch(`http://localhost:5000/api/faculty/notes/${selectedCourse._id}`, { headers: { Authorization: 'Bearer ' + token } });
                        const data = await res.json();
                        setNotes(data);
                        setEditingNoteId(null);
                      }}>Save</button>
                      <button onClick={() => setEditingNoteId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <strong>{n.title}</strong> — {n.description} — <a href={`http://localhost:5000${n.fileUrl}`} target="_blank">View</a>
                      <div style={{ marginTop: 6 }}>
                        <button onClick={() => { setEditingNoteId(n._id); setNoteEditTitle(n.title || ""); setNoteEditDesc(n.description || ""); }}>Edit</button>
                        <button style={{ marginLeft: 8 }} onClick={async () => {
                          if (!confirm('Delete this note?')) return;
                          await fetch(`http://localhost:5000/api/faculty/notes/${n._id}`, {
                            method: 'DELETE', headers: { Authorization: 'Bearer ' + token }
                          });
                          setNotes(notes.filter(x => x._id !== n._id));
                        }}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Assignments you created (edit/delete) */}
          <h3>✏️ Manage Assignments</h3>
          {assignments.length === 0 ? (
            <p style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>No assignments yet.</p>
          ) : (
            <ul>
              {assignments.map(a => (
                <li key={a._id} style={{ marginBottom: 12 }}>
                  {editingAssignmentId === a._id ? (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <input value={assignmentEditTitle} onChange={e => setAssignmentEditTitle(e.target.value)} placeholder="Title" />
                      <input value={assignmentEditDesc} onChange={e => setAssignmentEditDesc(e.target.value)} placeholder="Description" />
                      <input type="date" value={assignmentEditDue} onChange={e => setAssignmentEditDue(e.target.value)} />
                      <button onClick={async () => {
                        await fetch(`http://localhost:5000/api/faculty/assignments/${a._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                          body: JSON.stringify({ title: assignmentEditTitle, description: assignmentEditDesc, dueDate: assignmentEditDue })
                        });
                        // refresh
                        const res = await fetch(`http://localhost:5000/api/faculty/assignments/${selectedCourse._id}`, { headers: { Authorization: 'Bearer ' + token } });
                        const data = await res.json();
                        setAssignments(data);
                        setEditingAssignmentId(null);
                      }}>Save</button>
                      <button onClick={() => setEditingAssignmentId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <strong>{a.title}</strong> — {a.description} — Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '-'}
                      <div style={{ marginTop: 6 }}>
                        <button onClick={() => { setEditingAssignmentId(a._id); setAssignmentEditTitle(a.title || ""); setAssignmentEditDesc(a.description || ""); setAssignmentEditDue(a.dueDate ? a.dueDate.substring(0,10) : ""); }}>Edit</button>
                        <button style={{ marginLeft: 8 }} onClick={async () => {
                          if (!confirm('Delete this assignment?')) return;
                          await fetch(`http://localhost:5000/api/faculty/assignments/${a._id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
                          setAssignments(assignments.filter(x => x._id !== a._id));
                        }}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Grades (edit marks/maxMarks) */}
          <h3>🧮 Grades</h3>
          {/* New Grade Form */}
          <div style={{ margin: '10px 0', padding: 10, background: '#f8f9fa', borderRadius: 6 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <select value={newGradeStudent} onChange={e => setNewGradeStudent(e.target.value)}>
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                ))}
              </select>
              <input type="number" placeholder="Marks" value={newGradeMarks} onChange={e => setNewGradeMarks(e.target.value)} style={{ width: 100 }} />
              <input type="number" placeholder="Max" value={newGradeMax} onChange={e => setNewGradeMax(e.target.value)} style={{ width: 100 }} />
              <button onClick={async () => {
                if (!newGradeStudent || newGradeMarks === '' || newGradeMax === '') { alert('Select student and enter marks/max'); return; }
                const payload = { courseId: selectedCourse._id, studentId: newGradeStudent, marks: Number(newGradeMarks), maxMarks: Number(newGradeMax) };
                const res = await fetch('http://localhost:5000/api/faculty/grades', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                  body: JSON.stringify(payload)
                });
                if (!res.ok) { const t = await res.text(); alert('Failed to upload grade: ' + t); return; }
                // refresh grades
                const gRes = await fetch(`http://localhost:5000/api/faculty/grades/${selectedCourse._id}`, { headers: { Authorization: 'Bearer ' + token } });
                const gData = await gRes.json();
                setGrades(gData);
                setNewGradeStudent(""); setNewGradeMarks(""); setNewGradeMax("");
              }}>Add Grade</button>
            </div>
          </div>
          {grades.length === 0 ? (
            <p style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>No grades yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Student</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Marks</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Max</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g._id}>
                    <td style={{ padding: '6px 4px' }}>{g.student?.name} ({g.student?.email})</td>
                    <td style={{ padding: '6px 4px' }}>
                      <input defaultValue={g.marks} onChange={e => { g._newMarks = e.target.value; }} style={{ width: 80 }} />
                    </td>
                    <td style={{ padding: '6px 4px' }}>
                      <input defaultValue={g.maxMarks} onChange={e => { g._newMax = e.target.value; }} style={{ width: 80 }} />
                    </td>
                    <td style={{ padding: '6px 4px' }}>
                      <button onClick={async () => {
                        const payload = {
                          marks: g._newMarks !== undefined ? Number(g._newMarks) : g.marks,
                          maxMarks: g._newMax !== undefined ? Number(g._newMax) : g.maxMarks,
                        };
                        await fetch(`http://localhost:5000/api/faculty/grades/${g._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                          body: JSON.stringify(payload)
                        });
                        // refresh
                        const res = await fetch(`http://localhost:5000/api/faculty/grades/${selectedCourse._id}`, { headers: { Authorization: 'Bearer ' + token } });
                        const data = await res.json();
                        setGrades(data);
                      }}>Save</button>
                      <button style={{ marginLeft: 8 }} onClick={async () => {
                        if (!confirm('Delete this grade?')) return;
                        await fetch(`http://localhost:5000/api/faculty/grades/${g._id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
                        // refresh
                        const res = await fetch(`http://localhost:5000/api/faculty/grades/${selectedCourse._id}`, { headers: { Authorization: 'Bearer ' + token } });
                        const data = await res.json();
                        setGrades(data);
                      }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Student Assignment Submissions */}
          <h3>📚 Student Assignment Submissions</h3>
          {assignments.length === 0 ? (
            <p style={{ padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px" }}>
              No assignments found for this course.
            </p>
          ) : (
            <div>
              {assignments.map(assignment => (
                <div key={assignment._id} style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
                  <h4>{assignment.title}</h4>
                  <p><strong>Description:</strong> {assignment.description}</p>
                  <p><strong>Due Date:</strong> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '-'}</p>
                  <a href={`http://localhost:5000${assignment.fileUrl}`} target="_blank" style={{ marginRight: "15px" }}>
                    📎 View Assignment Question
                  </a>

                  <h5>Submissions ({assignment.submissions?.length || 0})</h5>
                  {(assignment.submissions?.length || 0) === 0 ? (
                    <p style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                      No submissions yet.
                    </p>
                  ) : (
                    <ul>
                      {assignment.submissions.map(submission => (
                        <li key={submission._id} style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                          <strong>{submission.student?.name}</strong> ({submission.student?.email})
                          <br />
                          <strong>Submitted:</strong> {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : '-'}
                          <br />
                          <a href={`http://localhost:5000${submission.fileUrl}`} target="_blank" download>
                            📥 Download Submission
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
