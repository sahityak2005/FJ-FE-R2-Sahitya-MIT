'use client'; // Add this line to mark this file as a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
      router.push('/auth/login'); // Redirect to login if not authenticated
    } else if (storedUser) {
      setUserData(storedUser); // Set user data if logged in
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(userData));
    alert('Profile updated successfully!'); // You can use a toast here
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false); // Update context state
    router.push('/auth/login'); // Redirect to login page after logout
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
        <Heading>Your Profile</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} mt={4}>
            <FormControl id="fullName" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
              />
            </FormControl>
            <Button colorScheme="teal" type="submit" width="full">
              Update Profile
            </Button>
          </VStack>
        </form>
        <Button colorScheme="red" onClick={handleLogout} mt={4} width="full">
          Logout
        </Button>
      </Box>
    </>
  );
};

export default Profile;
