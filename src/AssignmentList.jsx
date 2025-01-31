const AssignmentList = ({ assignments, toggleComplete, removeAssignment }) => {
    return (
      <div className="assignment-list">
        {assignments.length === 0 ? (
          <p>No assignments added.</p>
        ) : (
          assignments.map((assignment, index) => (
            <div key={index} className="assignment-item">
              <input
                type="checkbox"
                checked={assignment.completed}
                onChange={() => toggleComplete(index)}
              />
              <span className={assignment.completed ? "completed" : ""}>
                {assignment.title} (Due: {assignment.dueDate})
              </span>
              <button onClick={() => removeAssignment(index)}>❌</button>
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default AssignmentList;
  