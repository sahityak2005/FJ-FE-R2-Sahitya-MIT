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
      map.remove(); // Clean up map
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
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            aria-label="Toggle Color Mode"
            onClick={toggleColorMode}
            colorScheme="teal"
          />
        </HStack>
      </Flex>

      {/* Map Container */}
      <Box id="map" h="400px" />

      {/* Form for Ride Request */}
      <VStack spacing={4} p={4}>
        <FormControl>
          <FormLabel>Pickup Location</FormLabel>
          <Input
            placeholder="Enter pickup location or click on map"
            value={pickupLocation}
            readOnly
          />
        </FormControl>
        <FormControl>
          <FormLabel>Drop-off Location</FormLabel>
          <Input
            placeholder="Enter drop-off location or click on map"
            value={dropoffLocation}
            readOnly
          />
        </FormControl>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Ride Type</FormLabel>
            <Select value={rideType} onChange={(e) => setRideType(e.target.value)}>
              <option value="economy">Economy</option>
              <option value="luxury">Luxury</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Ride Sharing</FormLabel>
            <Checkbox
              isChecked={isRideSharing}
              onChange={(e) => setIsRideSharing(e.target.checked)}
            >
              Share with others
            </Checkbox>
            {isRideSharing && (
              <Select
                value={numberOfSharers}
                onChange={(e) => setNumberOfSharers(parseInt(e.target.value))}
              >
                {[...Array(5)].map((_, index) => (
                  <option key={index} value={index + 1}>{index + 1}</option>
                ))}
              </Select>
            )}
          </FormControl>
        </HStack>
        <Button colorScheme="teal" onClick={handleFindRide}>
          Find Ride
        </Button>
        <Button colorScheme="blue" onClick={onOpen}>
          Redeem Loyalty Points
        </Button>
        {estimatedFare && <Text>Your estimated fare: ${estimatedFare}</Text>}
      </VStack>

      {/* Loyalty Points Modal */}
      <Modal isOpen={isLoyaltyOpen} onClose={onLoyaltyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Redeem Loyalty Points</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>You have {loyaltyPoints} loyalty points.</Text>
            <Text>Redeem 50 points for a $5 discount?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleRedeemPoints}>
              Redeem
            </Button>
            <Button variant="ghost" onClick={onLoyaltyClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HomePage;

