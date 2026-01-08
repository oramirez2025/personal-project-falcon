import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  Field,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MotionBox } from "../components/Motion";
import { userLogIn } from "../utilities";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedIn = await userLogIn(email, password);

    if (!loggedIn) {
      alert("Invalid email or password");
      return;
    }

    navigate("/");
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
          Log In
        </Text>

        <form onSubmit={handleSubmit}>
          <Field.Root mb="5" required>
            <Field.Label color="gold">Email Address</Field.Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="#1a1a1a"
              color="black"
              border="1px solid red"
              _focus={{
                borderColor: "red",
                boxShadow: "0 0 10px red",
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
              bg="#1a1a1a"
              color="black"
              border="1px solid red"
              _focus={{
                borderColor: "red",
                boxShadow: "0 0 10px red",
              }}
            />
          </Field.Root>

          <Button
            type="submit"
            w="100%"
            bg="transparent"
            color="gold"
            border="1px solid red"
            fontWeight="bold"
            _hover={{
              bg: "red",
              color: "black",
              boxShadow: "0 0 15px red",
            }}
          >
            Log In
          </Button>
        </form>
      </MotionBox>
    </Box>
  );
};

export default LogInPage;
