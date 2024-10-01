'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';

const RideHistory = () => {
  const [rides, setRides] = useState([
    { id: 1, pickup: 'Location A', dropoff: 'Location B', fare: 20 },
    { id: 2, pickup: 'Location C', dropoff: 'Location D', fare: 30 },
    // Add more dummy data if needed
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRide, setSelectedRide] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleFeedbackClick = (ride) => {
    setSelectedRide(ride);
    onOpen();
  };

  const handleSubmitFeedback = async () => {
    if (!feedback) return;

    // Here you would send the feedback to the backend (API route)
    console.log(`Feedback for ride ${selectedRide.id}: ${feedback}`);

    // Reset the feedback and close modal
    setFeedback('');
    onClose();

    // Optional: Display a confirmation message (could be added as a toast)
    alert(`Feedback for ride ${selectedRide.id} submitted!`);
  };

  return (
    <Box p={8}>
      <Heading size="lg" mb={4}>
        Ride History
      </Heading>

      <VStack spacing={6} align="stretch">
        {rides.map((ride) => (
          <Box key={ride.id} p={4} borderWidth={1} borderRadius="md">
            <HStack justify="space-between">
              <Text>
                Pickup: {ride.pickup} | Drop-off: {ride.dropoff} | Fare: $
                {ride.fare}
              </Text>
              <Button
                size="sm"
                colorScheme="teal"
                onClick={() => handleFeedbackClick(ride)}
              >
                Provide Feedback
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Feedback Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feedback for Ride</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Enter your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmitFeedback}>
              Submit Feedback
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RideHistory;
