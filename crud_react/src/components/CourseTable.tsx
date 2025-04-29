import { Flex, Heading, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Course } from '../interfaces/course';

interface CourseTableProps {
	courses: Course[] | null;
	isLoading: boolean;
}

const CourseTable = ({ courses, isLoading }: CourseTableProps) => {
	if (!courses || courses.length === 0) {
		return (
			<Flex
				justify='center'
				align='center'
				py={10}>
				<Heading
					size='lg'
					color='gray.500'>
					No courses found
				</Heading>
			</Flex>
		);
	}

	if (isLoading) {
		return (
			<Flex
				justify='center'
				align='center'
				py={10}>
				<Spinner size='xl' />
			</Flex>
		);
	}

	return (
		<TableContainer>
			<Table size='md'>
				<Thead>
					<Tr>
						<Th>Nome</Th>
						<Th>Categoria</Th>
						<Th>Status</Th>
						<Th>Lições</Th>
						<Th textAlign={'right'}>Ações</Th>
					</Tr>
				</Thead>
				<Tbody>
					{courses.map((course) => (
						<Tr key={course.id}>
							<Td>{course.name}</Td>
							<Td>{course.category}</Td>
							<Td>{course.status}</Td>
							<Td>{course.lessons.length}</Td>
							{/* <Td textAlign={'right'}>
								<Button colorScheme='blue' size='sm'>
									Editar
								</Button>
							</Td> */}
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
};

export default CourseTable;
