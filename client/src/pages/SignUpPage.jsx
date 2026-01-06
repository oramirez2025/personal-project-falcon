import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useOutletContext } from "react-router-dom";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    const data = { email, password };
    const response = await axios.post(
      "http://127.0.0.1:8000/user/new_account/",
      data
    );

    alert("We've Made Your Badass Account");

    if (response.status === 201) {
      let { user, token } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      setUser(user);
    }

    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "black",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "red",
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "bold",
        }}
      >
        Sign Up
      </h1>

      <Form
        onSubmit={handleClick}
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
            name="email"
            style={{
              backgroundColor: "black",
              color: "white",
              border: "2px solid red",
            }}
          />
          <Form.Text style={{ color: "white" }}>
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label style={{ color: "white" }}>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            name="password"
            style={{
              backgroundColor: "black",
              color: "white",
              border: "2px solid red",
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
          }}
        >
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default SignUp;
