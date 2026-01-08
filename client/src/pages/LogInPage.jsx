import axios from "axios";
import { useState } from "react";
import {Button} from "@chakra-ui/react";
import {showSuccessToast} from "../components/ui/showSuccessToast";
import {showErrorToast} from "../components/ui/showErrorToast";
import Form from "react-bootstrap/Form";
import { useOutletContext, useNavigate } from "react-router-dom";
import { userLogIn } from "../utilities";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser} = useOutletContext();
  const navigate = useNavigate();


  const handleSubmit = async(e) => { 
      e.preventDefault(); 
      try {
        const loggedIn = await userLogIn(email,password);
        showSuccessToast("Log In", "Welcome back!")
        setUser(loggedIn);
        navigate("/");
      }
      catch (err) {
        showErrorToast("Log In", err.response?.data.error || "Something went wrong :(")
      }
  }
  return (
    <>
      <h1>Log In</h1>
      <Form
        onSubmit={(e) => handleSubmit(e)}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button bg="red.800" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LogIn;