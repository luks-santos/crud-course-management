import { Box, Container, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<Box
			minH='100vh'
			bg='gray.50'
		>
			<Container
				maxW='container.lg'
				py={1}
			>
				<Flex direction='column'>{children}</Flex>
			</Container>
		</Box>
	);
};

export default Layout;
