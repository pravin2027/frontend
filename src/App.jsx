import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./signup";
import AssignmentTracker from "./AssignmentTracker";
import "./Styles.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <div>
      {!loggedIn ? (
        showSignUp ? (
          <Signup onSignup={() => setShowSignUp(false)} showLogin={() => setShowSignUp(false)} />
        ) : (
          <Login onLogin={handleLogin} showSignup={() => setShowSignUp(true)} />
        )
      ) : (
        <>
          <button onClick={handleLogout} style={{ position: 'absolute', top: '20px', right: '20px' }}>
            Logout
          </button>
          <AssignmentTracker />
        </>
      )}
    </div>
  );
};

export default App;
