import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { MotionBox } from "../components/Motion";
import { fadeInUp } from "../components/animations/fffAnimations";
import { showSuccessToast } from "../components/ui/showSuccessToast";
import { showErrorToast } from "../components/ui/showErrorToast";
import { useOutletContext, useNavigate } from "react-router-dom";
import { userLogIn } from "../utilities";
import { inputStyles, primaryButtonStyles } from "../theme";
import griffonBg from "../assets/Lightning Griffon.jpeg";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedIn = await userLogIn(email, password);
      showSuccessToast("Log In", "Welcome back!");
      setUser(loggedIn);
      navigate("/");
    } catch (err) {
      showErrorToast(
        "Log In",
        err.response?.data.error || "Something went wrong :("
      );
    }
  };

  return (
    <Box
      position="relative"
      bgImage={`url(${griffonBg})`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bg: "linear-gradient(145deg, rgba(0,0,0,0.75), rgba(255,80,0,0.35))",
        zIndex: 0,
      }}
    >
      <Container maxW="md" position="relative" zIndex={1}>
        <MotionBox {...fadeInUp}>
          <Box
            bg="rgba"
            borderRadius="lg"
            borderWidth="2px"
            borderColor="border.accent"
            p={8}
            boxShadow="xl"
          >
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
              <Heading size="xl" color="text.primary">
                Log In
              </Heading>

              <Field.Root w="100%">
                <Field.Label color="text.secondary">Email address</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  {...inputStyles}
                  required
                />
                <Field.HelperText color="text.muted" fontSize="sm">
                  We'll never share your email with anyone else.
                </Field.HelperText>
              </Field.Root>

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

              <Button type="submit" w="100%" size="lg" {...primaryButtonStyles}>
                Submit
              </Button>
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default LogIn;
