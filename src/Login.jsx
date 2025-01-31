import { useState } from "react";
import axios from "axios";

const Login = ({ onLogin, showSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backend-e2vm.onrender.com/api/users/login', {
        email,
        password
      });

      // Clear any previous errors
      setError("");

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      onLogin(user);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container active">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <a href="#" onClick={showSignup}>
          Sign up
        </a>
      </p>
    </div>
  );
};

export default Login;
