import axios from "axios";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import Form from "react-bootstrap/Form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { showSuccessToast } from "../components/ui/showSuccessToast";
import { showErrorToast } from "../components/ui/showErrorToast";

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

    try {
      const data = { email, password };
      const response = await axios.post(
        "http://127.0.0.1:8000/user/new_account/",
        data
      );

      const { user, token } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;

      showSuccessToast("Sign up","We've Made Your Badass Account");
      setUser(user);
      navigate("/");
    } catch (err) {
      showErrorToast("Sign up", err.response?.data.error || "Something went wrong :(");
    }
  };

  return (
    <>
      <h1>SignUp</h1>

      <Form onSubmit={handleClick}>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>

        <Button type="submit">Submit</Button>
      </Form>
    </>
  );
};

export default SignUp;
