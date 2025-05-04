import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

interface ModalConfirmationProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	isLoading?: boolean;
}

const ModalDeleteConfirm = ({ isOpen, onClose, onConfirm, title, message, isLoading = false }: ModalConfirmationProps) => {
	const cancelRef = useRef<HTMLButtonElement>(null);

	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader
						fontSize='lg'
						fontWeight='bold'
					>
						{title}
					</AlertDialogHeader>

					<AlertDialogBody>{message}</AlertDialogBody>

					<AlertDialogFooter>
						<Button
							ref={cancelRef}
							onClick={onClose}
							isDisabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							colorScheme='red'
							onClick={onConfirm}
							ml={3}
							isLoading={isLoading}
							loadingText='Deleting...'
						>
							Confirm
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

export default ModalDeleteConfirm;
