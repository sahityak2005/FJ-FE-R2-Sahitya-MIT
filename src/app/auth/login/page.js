'use client';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (
      storedUser &&
      storedUser.username === username &&
      storedUser.password === password
    ) {
      localStorage.setItem('isLoggedIn', true);
      setIsLoggedIn(true); // Update context state
      router.push('/'); // Redirect to home page
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Set background color based on color mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');

  return (
    <>
      <Navbar />
      <Box
        maxW="400px"
        mx="auto"
        mt={10}
        p={5}
        boxShadow="md"
        borderRadius="md"
        bg={bgColor} // Apply dynamic background color
        color={textColor} // Apply dynamic text color
      >
        <Heading textAlign="center">Login</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} mt={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full">
              Login
            </Button>
            <Text textAlign="center" color="gray.500">
              Don't have an account?{' '}
              <Link href="/auth/register" style={{ color: 'teal' }}>
                Register
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default Login;
