import { useState } from "react";
import { authService } from "./services/api";

const Signup = ({ onSignup, showLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log('Attempting signup with API URL:', import.meta.env.VITE_API_URL);
      const response = await authService.signup({
        name,
        email,
        password
      });

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      // Show success message and redirect to login
      alert("Sign up successful! Please log in.");
      showLogin();
    } catch (error) {
      let errorMessage = "Unable to connect to server. Please try again later.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage = "No response from server. Please check your internet connection.";
      }
      
      setError(errorMessage);
      console.error('Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container active">
      <h1>Sign Up</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <a href="#" onClick={showLogin}>
          Login
        </a>
      </p>
    </div>
  );
};

export default Signup;
