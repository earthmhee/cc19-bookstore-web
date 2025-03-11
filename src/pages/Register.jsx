import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
const initInput = {
  username: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  email: "",
};
function Register() {
  const [input, setInput] = useState(initInput);

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };
  const hdlClearInput = () => {
    setInput(initInput);
  };
  const hdlRegister = async e => {
    try {
      const { firstName, lastName, username, password, confirmPassword,email } = input;
    e.preventDefault();
    //validation
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === "" ||
      email.trim() === ""
    ) {
      console.log("Please fill all fields");
    }
    if (password !== confirmPassword) {
      console.log("password not match");
      return toast.error("Password not match");
    }
    console.log(input);
    
    //send API to server
    const rs = await axios.post('http://localhost:8050/auth/register', input)
    hdlClearInput();
    document.getElementById('register-form').close()
    toast.success("Register success")
  
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message || err.message
      toast.error(errMsg)
    }
  }

  return (
    <>
      <div>
        <div className="text-center text-xl opacity-70 text-yellow-400">
          Create an account
        </div>
        <div className="divider opacity-30 bg-gray-400 h-1"></div>
        <form
          onSubmit={hdlRegister}
          className="card-body flex items-center justify-center"
        >
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Email"
            value={input.email}
            onChange={hdlChange}
            name="email"
          />
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
          <button className="btn btn-secondary text-xl w-full" type="submit">
            Sign up
          </button>
          <button
            type="button"
            className="btn btn-secondary text-xl w-full"
            onClick={hdlClearInput}
          >
            Reset
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
