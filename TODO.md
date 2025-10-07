# TODO: Fix Field Name Inconsistencies in Assignment and Note Models

## Pending Tasks
- [x] Update Assignment.js model: Change `courseId` to `course`, `facultyId` to `faculty`, and `studentId` to `student` in submissions array.
- [x] Update Note.js model: Change `courseId` to `course`, `facultyId` to `faculty`.
- [ ] Test the changes: Run the server and verify that assignments and notes appear on the student dashboard.
- [ ] If needed, update any other references to these fields (e.g., in routes or frontend code).

## Completed Tasks
- [x] Read and analyze Assignment.js and Note.js models.
- [x] Confirm field inconsistencies causing query failures.
