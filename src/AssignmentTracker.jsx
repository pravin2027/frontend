import { useState, useEffect } from "react";
import { assignmentService } from "./services/api";

const AssignmentTracker = () => {
  const [assignments, setAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    dueDate: "",
    description: "",
    progress: 0,
    isSubmitted: false
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await assignmentService.fetchAssignments();
      const active = data.filter(a => !a.isSubmitted);
      const submitted = data.filter(a => a.isSubmitted);
      setAssignments(active);
      setSubmittedAssignments(submitted);
    } catch (error) {
      console.error("Error loading assignments:", error);
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addOrUpdateAssignment = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment._id, formData);
      } else {
        await assignmentService.addAssignment(formData);
      }
      await loadAssignments();
      resetForm();
      setEditingAssignment(null);
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const editAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setFormData(assignment);
  };

  const handleDelete = async (id) => {
    try {
      await assignmentService.deleteAssignment(id);
      await loadAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const submitAssignment = async (assignment) => {
    try {
      await assignmentService.updateAssignment(assignment._id, {
        ...assignment,
        isSubmitted: true
      });
      await loadAssignments();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      dueDate: "",
      description: "",
      progress: 0,
      isSubmitted: false
    });
  };

  return (
    <div className="container active">
      <h2>{editingAssignment !== null ? "Edit Assignment" : "Add a New Assignment"}</h2>
      <form onSubmit={addOrUpdateAssignment}>
        <input type="text" name="name" placeholder="Assignment Name" required value={formData.name} onChange={handleChange} />
        <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
        <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleChange} />
        <textarea name="description" placeholder="Description" rows="3" required value={formData.description} onChange={handleChange}></textarea>
        <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} />
        <label>Progress: {formData.progress}%</label>
        <button type="submit">{editingAssignment !== null ? "Update Assignment" : "Add Assignment"}</button>
      </form>

      <h2>Your Assignments</h2>
      <ul>
        {assignments.map((assignment, index) => (
          <li key={index}>
            <strong>{assignment.name}</strong> - {assignment.subject} (Due: {assignment.dueDate})
            <p>{assignment.description}</p>
            <p>Progress: {assignment.progress}%</p>
            <button onClick={() => editAssignment(assignment)}>Edit</button>
            <button onClick={() => submitAssignment(assignment)}>Submit</button>
            <button onClick={() => handleDelete(assignment._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Submitted Assignments</h2>
      <ul>
        {submittedAssignments.map((assignment, index) => (
          <li key={index}>
            <strong>{assignment.name}</strong> - {assignment.subject} (Submitted)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentTracker;
