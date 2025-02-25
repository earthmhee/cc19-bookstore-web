import React, { useState } from "react";

function Register() {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <div>
        <div className="text-center text-xl opacity-70 text-yellow-400">
          Create an account
        </div>
        <div className="divider opacity-30 bg-gray-400 h-1"></div>
        <form className="card-body flex items-center justify-center">
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Username"
            value={input.username}
            onChange={hdlChange}
            name="username"
          />
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Password"
            value={input.password}
            onChange={hdlChange}
            name="password"
          />
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Confirm Password"
            value={input.confirmPassword}
            onChange={hdlChange}
            name="confirmPassword"
          />
          <div className="flex gap-2">
            <input
              className="input input-bordered w-full"
              type="text"
              placeholder="Firstname"
              value={input.firstName}
              onChange={hdlChange}
              name="firstName"
            />
            <input
              className="input input-bordered w-full"
              type="text"
              placeholder="Lastname"
              value={input.lastName}
              onChange={hdlChange}
              name="lastName"
            />
          </div>
          <button className="btn btn-secondary text-xl w-full">Sign up</button>
        </form>
      </div>
    </>
  );
}

export default Register;
