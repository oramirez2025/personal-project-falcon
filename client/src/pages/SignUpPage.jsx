import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { MotionBox } from "../components/Motion";
import { fadeInUp } from "../components/animations/fffAnimations";
import { useNavigate, useOutletContext } from "react-router-dom";
import { showSuccessToast } from "../components/ui/showSuccessToast";
import { showErrorToast } from "../components/ui/showErrorToast";
import { api } from "../utilities";
import { inputStyles, primaryButtonStyles } from "../theme";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useOutletContext();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const data = { email, password };
      const response = await api.post("user/new_account/", data);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;

      showSuccessToast("Sign up", "We've Made Your Badass Account");
      setUser(user);
      navigate("/");
    } catch (err) {
      showErrorToast(
        "Sign up",
        err.response?.data.error || "Something went wrong :("
      );
    }
  };

  return (
    <Container maxW="md" py={20}>
      <MotionBox {...fadeInUp}>
        <Box
          bg="bg.secondary"
          borderRadius="lg"
          borderWidth="2px"
          borderColor="border.accent"
          p={8}
          boxShadow="xl"
        >
          <VStack spacing={6} as="form" onSubmit={handleClick}>
            {/* Header */}
            <Heading size="xl" color="text.primary">
              Sign Up
            </Heading>

            {/* Email Field */}
            <Field.Root w="100%">
              <Field.Label color="text.secondary">Email Address</Field.Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                {...inputStyles}
                required
              />
            </Field.Root>

            {/* Password Field */}
            <Field.Root w="100%">
              <Field.Label color="text.secondary">Password</Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                {...inputStyles}
                required
              />
            </Field.Root>

            {/* Submit Button */}
            <Button
              type="submit"
              w="100%"
              size="lg"
              {...primaryButtonStyles}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default SignUp;