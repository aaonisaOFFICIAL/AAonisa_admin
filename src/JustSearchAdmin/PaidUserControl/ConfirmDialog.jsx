import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {description}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onConfirm}>
                        Yes
                    </Button>
                    <Button variant="ghost" onClick={onClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmDialog;
