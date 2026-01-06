import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useOutletContext, useNavigate } from "react-router-dom";
import { userLogIn } from "../utilities";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedIn = await userLogIn(email, password);

    if (!loggedIn) {
      alert("Something went wrong with login");
    } else {
      setUser(loggedIn);
      navigate("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "black",
        padding: "40px"
      }}
    >
      <h1
        style={{
          color: "red",
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "bold"
        }}
      >
        Log In
      </h1>

      <Form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          color: "white",
          border: "3px solid red",
          padding: "30px",
          boxShadow: "0 0 20px red",
          borderRadius: "10px"
        }}
      >
        
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label style={{ color: "white" }}>Email Address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter email"
            style={{
              backgroundColor: "black",
              color: "white",
              border: "2px solid red",
              boxShadow: "none",
              outline: "none"
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 10px red";
              e.target.style.borderColor = "red";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "red";
            }}
          />
        </Form.Group>

        
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label style={{ color: "white" }}>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            style={{
              backgroundColor: "black",
              color: "white",
              border: "2px solid red",
              // boxShadow: "none",
              // outline: "none"
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 10px red";
              e.target.style.borderColor = "red";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.borderColor = "red";
            }}
          />
        </Form.Group>

        
        <Button
          type="submit"
          className="w-100"
          style={{
            backgroundColor: "black",
            border: "2px solid red",
            color: "red",
            fontWeight: "bold",
            padding: "10px",
            // boxShadow: "0 0 10px red"
          }}
        >
          Log In
        </Button>
      </Form>
    </div>
  );
};

export default LogIn;
