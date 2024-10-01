// app/history/page.js

'use client'; // Mark this as a client component

import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Spacer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation'; // Import useRouter

const RideHistoryPage = () => {
  const router = useRouter(); // Initialize router

  // Dummy ride history data
  const rideHistory = [
    { id: 1, date: '2024-09-20', fare: '$15', driver: 'John Doe' },
    { id: 2, date: '2024-09-21', fare: '$25', driver: 'Jane Smith' },
    { id: 3, date: '2024-09-22', fare: '$20', driver: 'Alice Johnson' },
    { id: 4, date: '2024-09-23', fare: '$30', driver: 'Bob Brown' },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRide, setSelectedRide] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleFeedbackClick = (ride) => {
    setSelectedRide(ride);
    onOpen();
  };

  const handleSubmitFeedback = () => {
    if (!feedback) return;

    console.log(`Feedback for ride ${selectedRide.id}: ${feedback}`);
    
    // Reset feedback and close modal
    setFeedback('');
    onClose();

    // Optional: Display a confirmation message (could be added as a toast)
    alert(`Feedback for ride ${selectedRide.id} submitted!`);
  };

  return (
    <Box p={8}>
      <Flex mb={4} align="center">
        <Heading size="lg">Ride History</Heading>
        <Spacer />
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </Flex>
      <Table variant="simple">
        <TableCaption>Your past ride history</TableCaption>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Date</Th>
            <Th>Fare</Th>
            <Th>Driver</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rideHistory.map((ride) => (
            <Tr key={ride.id}>
              <Td>{ride.id}</Td>
              <Td>{ride.date}</Td>
              <Td>{ride.fare}</Td>
              <Td>{ride.driver}</Td>
              <Td>
                {/* Feedback button */}
                <Button size="sm" colorScheme="teal" onClick={() => handleFeedbackClick(ride)}>
                  Feedback
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

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

export default RideHistoryPage;
