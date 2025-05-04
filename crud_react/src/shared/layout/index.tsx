import { Box, Container, Flex, Heading } from '@chakra-ui/react';
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
			<Box
				as='header'
				bg='blue.600'
				color='white'
				py={3}
				px={6}
				boxShadow='md'
			>
				<Container maxW='container.xl'>
					<Heading
						as='h1'
						size='md'
					>
						Course Management
					</Heading>
				</Container>
			</Box>
			<Container
				maxW='container.xl'
				py={1}
			>
				<Flex direction='column'>{children}</Flex>
			</Container>
		</Box>
	);
};

export default Layout;
