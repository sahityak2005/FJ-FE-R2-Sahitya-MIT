'use client'; // Add this line to mark this file as a client component

import Navbar from '@/app/components/Navbar';
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

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Save user details in local storage
    localStorage.setItem(
      'user',
      JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password, // Save password (not recommended in real apps)
      })
    );

    // Set user logged in state
    localStorage.setItem('isLoggedIn', true);

    toast({
      title: 'Registration Successful.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Call your registration API here
  };

  // Set background color based on color mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');

  return (
    <>
      <Navbar />
      <Box
        w="100%"
        maxW="lg"
        mx="auto"
        mt={10}
        p={5}
        boxShadow="md"
        borderRadius="md"
        bg={bgColor} // Apply dynamic background color
        color={textColor} // Apply dynamic text color
      >
        <Heading mb={6}>Create an Account</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="fullName" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormControl>
            <Button colorScheme="teal" width="full" type="submit">
              Register
            </Button>
            <Text textAlign="center" color="gray.500">
              Already have an account?{' '}
              <a href="/auth/login" style={{ color: 'teal' }}>
                Login
              </a>
            </Text>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default Register;
