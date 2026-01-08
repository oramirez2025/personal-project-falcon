import React, { useState } from "react";
import { Box, Input, Button, Text, Field } from "@chakra-ui/react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MotionBox } from "../components/Motion";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/new_account/",
        data
      );

      if (response.status === 201) {
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Token ${token}`;
        setUser(user);
        alert("We've Made Your Badass Account");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong with sign up!");
    }
  };

  return (
    <Box
      minH="100vh"
      bg="black"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <MotionBox
        w="700px"
        p="70"
        border="2px solid red"
        borderRadius="lg"
        boxShadow="0 0 25px red"
        bg="black"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="gold"
          textAlign="center"
          mb="6"
        >
          Sign Up
        </Text>

        <form onSubmit={handleSubmit}>
          <Field.Root mb="5" required>
            <Field.Label color="gold">Email Address</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              bg="black"
              color="gold"
              fontSize="lg"
              border="2px solid red"
              p={4}
              _placeholder={{
                color: "gold",
                opacity: 1,
                fontSize: "lg",
              }}
              _focus={{
                borderColor: "gold",
                boxShadow: "0 0 10px gold",
              }}
            />
            <Text fontSize="sm" color="gold" mt="1">
              We’ll never share your email with anyone else.
            </Text>
          </Field.Root>

    
          <Field.Root mb="6" required>
            <Field.Label color="gold">Password</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              bg="black"
              color="gold"
              fontSize="lg"
              border="2px solid red"
              p={4}
              _placeholder={{
                color: "gold",
                opacity: 1,
                fontSize: "lg",
              }}
              _focus={{
                borderColor: "gold",
                boxShadow: "0 0 10px gold",
              }}
            />
          </Field.Root>

          
          <Button
            type="submit"
            w="100%"
            bg="transparent"
            color="gold"
            border="2px solid red"
            fontWeight="bold"
            _hover={{
              bg: "red",
              color: "black",
              boxShadow: "0 0 15px red",
            }}
          >
            Sign Up
          </Button>
        </form>
      </MotionBox>
    </Box>
  );
};

export default SignUpPage;
