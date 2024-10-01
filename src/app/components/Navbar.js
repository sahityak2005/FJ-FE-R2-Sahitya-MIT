// app/components/Navbar.js

'use client';

import { Box, Flex, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false); // Update context state
    router.push('/auth/login');
  };

  return (
    <Box bg="teal.500" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link href="/">
          <Text color="white" fontSize="xl" fontWeight="bold">
            Ride Sharing App
          </Text>
        </Link>
        <Flex>
          <Link href="/profile">
            <Text color="white" mx={4}>
              Profile
            </Text>
          </Link>
          {isLoggedIn ? (
            <Button
              colorScheme="teal"
              variant="link"
              onClick={handleLogout}
              color="white"
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth/login">
              <Text color="white" mx={4}>
                Login
              </Text>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
