# TODO: Fix Faculty Courses API Error

## Completed Tasks
- [x] Convert Course.js model from ES6 modules to CommonJS to match server setup
- [x] Change all 500 error responses in faculty.js from res.send("Server Error") to res.json({ error: "Server Error" }) to return JSON instead of plain text

## Next Steps
- [ ] Restart the server to apply changes
- [ ] Test the /api/faculty/courses endpoint to ensure it returns courses or proper error JSON
- [ ] Verify frontend no longer throws SyntaxError on 500 responses
