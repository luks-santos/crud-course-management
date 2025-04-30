import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';

interface ModalDeleteProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	data: {
		title: string;
		description: string;
	};
}

const ModalDelete = ({ isOpen, onClose, onConfirm, data }: ModalDeleteProps) => {
	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{data.title}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>{data.description}</ModalBody>
					<ModalFooter>
						<Button
							mr={3}
							onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme='red'
							onClick={onConfirm}>
							Delete
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ModalDelete;
