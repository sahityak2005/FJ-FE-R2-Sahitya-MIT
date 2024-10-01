'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Button,
  Heading,
  VStack,
  HStack,
  Spacer,
  Text,
  Select,
  Checkbox,
  IconButton,
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import Payment from './components/Payment';
import mapboxgl from 'mapbox-gl'; // Importing mapbox for map-based location selection
import 'mapbox-gl/dist/mapbox-gl.css'; // Importing Mapbox CSS

mapboxgl.accessToken = 'pk.eyJ1Ijoic2NvdGhpcyIsImEiOiJjaWp1Y2ltYmUwMDBicmJrdDQ4ZDBkaGN4In0.sbihZCZJ56-fsFNKHXF8YQ'; // Replace with your Mapbox access token

const HomePage = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [rideType, setRideType] = useState('economy');
  const [estimatedFare, setEstimatedFare] = useState('');
  const [isRideSharing, setIsRideSharing] = useState(false);
  const [numberOfSharers, setNumberOfSharers] = useState(1);
  const [loyaltyPoints, setLoyaltyPoints] = useState(100);
  const [discount, setDiscount] = useState(0);
  const [isSelectingDropoff, setIsSelectingDropoff] = useState(false); // For selecting between pickup and drop-off

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isLoyaltyOpen, onOpen: onLoyaltyOpen, onClose: onLoyaltyClose } = useDisclosure();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  // Initialize Mapbox and handle map clicks for location selection
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0], // Initial map center
      zoom: 2,
    });

    map.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      const location = `${lng}, ${lat}`;

      if (!isSelectingDropoff) {
        setPickupLocation(location);
        showToast("Pickup Location Set", `Pickup Location: ${location}`, "success");
      } else {
        setDropoffLocation(location);
        showToast("Drop-off Location Set", `Drop-off Location: ${location}`, "success");
      }
    });

    return () => {
      map.remove();
    };
  }, [isSelectingDropoff]);

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
    });
  };

  const handleFindRide = () => {
    let fare = rideType === 'economy' ? 15 : 25;
    if (isRideSharing && numberOfSharers > 1) {
      fare /= numberOfSharers;
    }
    if (discount) {
      fare -= discount;
      showToast("Discount Applied", `A discount of $${discount} has been applied!`, "success");
      setDiscount(0);
    }
    setEstimatedFare(fare);
    showToast("Ride Estimated", `Your estimated fare is $${fare}.`, "info");
    setLoyaltyPoints(loyaltyPoints + 10);
  };

  const handleRedeemPoints = () => {
    if (loyaltyPoints >= 50) {
      setDiscount(5);
      setLoyaltyPoints(loyaltyPoints - 50);
      showToast("Points Redeemed", "You have redeemed 50 points for a $5 discount.", "success");
      onLoyaltyClose();
    } else {
      showToast("Insufficient Points", "You need at least 50 points to redeem.", "warning");
    }
  };

  const handleHistoryClick = () => {
    if (isLoggedIn) {
      router.push('/history');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <Flex as="nav" bg="teal.500" p={4} color="white" align="center">
        <Heading size="lg">Ride Sharing App</Heading>
        <Spacer />
        <HStack spacing={4}>
          <Button variant="link" color="white" aria-label="Home" onClick={() => router.push('/')}>
            Home
          </Button>
          <Button variant="link" color="white" aria-label="Profile" onClick={() => router.push('/history')}>
            Ride History
          </Button>
          <Button variant="link" color="white" aria-label="Profile" onClick={() => router.push('/profile')}>
            Profile
          </Button>
          {isLoggedIn ? (
            <Button
              variant="link"
              color="white"
              aria-label="Logout"
              onClick={() => router.push('/auth/login')}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="link"
              color="white"
              aria-label="Login"
              onClick={() => router.push('/auth/login')}
            >
              Login
            </Button>
          )}
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            isRound
          />
        </HStack>
      </Flex>

      {/* Ride Booking Section */}
      <Flex p={8} direction={{ base: 'column', md: 'row' }}>
        <Box w={{ base: '100%', md: '50%' }} p={5}>
          <Heading size="md" mb={4}>
            Book a Ride
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl id="pickup" isRequired>
              <FormLabel>Pickup Location</FormLabel>
              <Input
                aria-label="Enter pickup location"
                placeholder="Enter pickup location or click on map"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
              <Button onClick={() => setIsSelectingDropoff(false)} colorScheme="teal">
                Select Pickup on Map
              </Button>
            </FormControl>
            <FormControl id="dropoff" isRequired>
              <FormLabel>Drop-off Location</FormLabel>
              <Input
                aria-label="Enter drop-off location"
                placeholder="Enter drop-off location or click on map"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
              <Button onClick={() => setIsSelectingDropoff(true)} colorScheme="teal">
                Select Drop-off on Map
              </Button>
            </FormControl>
            <FormControl id="ride-type" isRequired>
              <FormLabel>Choose Ride Type</FormLabel>
              <Select
                aria-label="Select ride type"
                placeholder="Select ride type"
                value={rideType}
                onChange={(e) => setRideType(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium</option>
              </Select>
            </FormControl>

            <FormControl id="ride-sharing">
              <Checkbox
                aria-label="Share Ride"
                isChecked={isRideSharing}
                onChange={(e) => setIsRideSharing(e.target.checked)}
              >
                Share Ride
              </Checkbox>
              {isRideSharing && (
                <Input
                  type="number"
                  aria-label="Number of Sharers"
                  placeholder="Number of Sharers"
                  value={numberOfSharers}
                  min={1}
                  onChange={(e) => setNumberOfSharers(Number(e.target.value))}
                />
              )}
            </FormControl>

            <Text fontSize="lg" color="teal.500" aria-live="polite">
              Estimated Fare: ${estimatedFare}
            </Text>
            <Button colorScheme="teal" width="full" aria-label="Find Ride" onClick={handleFindRide}>
              Find Ride
            </Button>
            {estimatedFare && <Payment amount={estimatedFare} />}

            {/* Chat and Loyalty Buttons */}
            <Button colorScheme="teal" width="full" aria-label="Chat with Driver" onClick={onOpen}>
              Chat with Driver
            </Button>
            <Button colorScheme="teal" width="full" aria-label="Loyalty Program" onClick={onLoyaltyOpen}>
              Loyalty Program
            </Button>
          </VStack>
        </Box>

        {/* Map Container */}
        <Box w={{ base: '100%', md: '50%' }} h="500px" p={5}>
          <Box id="map" h="100%" />
        </Box>
      </Flex>

      {/* Modal for Chat */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat with Driver</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Start a conversation with your driver here!</Text>
            <Input placeholder="Type your message..." />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3}>
              Send
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Loyalty Program */}
      <Modal isOpen={isLoyaltyOpen} onClose={onLoyaltyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Loyalty Program</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Your Loyalty Points: {loyaltyPoints}</Text>
            <Button
              onClick={handleRedeemPoints}
              colorScheme="teal"
              isDisabled={loyaltyPoints < 50}
              mt={4}
            >
              Redeem 50 Points for $5 Discount
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onLoyaltyClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HomePage;
