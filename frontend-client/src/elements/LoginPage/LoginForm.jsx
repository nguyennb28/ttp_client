import React, { useState } from "react";
import Input from "../../components/Input";

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert(`Missing login information`);
      return;
    }
    onSubmit(username, password);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* username */}
        <Input
          label="Username"
          id="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={handleUsernameChange}
        />
        {/* password */}
        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        <div className="px-10 my-5">
          <button
            type="submit"
            className="cursor-pointer border bg-sky-950 w-full text-white p-3 rounded-2xl font-bold hover:bg-cyan-600"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
