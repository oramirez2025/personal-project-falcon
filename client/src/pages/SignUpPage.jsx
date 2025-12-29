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
  const {setUser} = useOutletContext();
  const navigate = useNavigate()
    const handleClick = async (e) => {
        e.preventDefault()
        const data = {"email": email, "password": password}
        const response = await axios.post("http://127.0.0.1:8000/signup/new_account/", data);
        console.log(response.data)
        alert("We've Made Your Badass Account");
        if (response.status === 201) {
            let { user, token } = response.data;
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Token ${token}`;
            setUser(user)
      }     
        navigate("/")
    
    };
  return (
    <>
      <h1>SignUp</h1>
      <Form onSubmit= {(e) => handleClick(e)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter email"
            name="email"
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
            name = "password"
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
        
      </Form>
    </>
  );
};

export default SignUp;