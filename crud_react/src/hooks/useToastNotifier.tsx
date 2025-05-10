import { useToast } from '@chakra-ui/react';

interface ToastOptions {
	title: string;
	description: string;
	status: 'info' | 'warning' | 'success' | 'error' | 'loading';
}
export const useToastNotifier = () => {
	const toast = useToast();
	const showToast = ({ title, description, status }: ToastOptions) => {
		return toast({
			title: title,
			description: description,
			status: status,
			duration: 6000,
			isClosable: true,
		});
	};
	return { showToast };
};
