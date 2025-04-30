import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Badge, Flex, Heading, IconButton, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Category } from '../interfaces/category.enum';
import { Course } from '../interfaces/course';
import { Status } from '../interfaces/status.enum';

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

	const getCategoryColor = (category: Category) => {
		switch (category) {
			case Category.FRONTEND:
				return 'blue';
			case Category.BACKEND:
				return 'green';
			case Category.FULLSTACK:
				return 'purple';
			default:
				return 'gray';
		}
	};

	const getStatusColor = (status: Status) => {
		return status === Status.ACTIVE ? 'green' : 'red';
	};

	return (
		<TableContainer>
			<Table size='md'>
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Category</Th>
						<Th>Status</Th>
						<Th>Lessons</Th>
						<Th textAlign={'right'}>Actions</Th>
					</Tr>
				</Thead>
				<Tbody>
					{courses.map((course) => (
						<Tr key={course.id}>
							<Td>{course.name}</Td>
							<Td>
								<Badge colorScheme={getCategoryColor(course.category)}>{course.category}</Badge>
							</Td>
							<Td>
								<Badge colorScheme={getStatusColor(course.status)}>{course.status}</Badge>
							</Td>
							<Td>{course.lessons.length}</Td>
							<Td textAlign={'right'}>
								<IconButton
									onClick={() => null}
									aria-label='Edit course'
									icon={<EditIcon />}
									color={'blue.500'}
								/>
								<IconButton
									onClick={() => null}
									aria-label='Delete course'
									icon={<DeleteIcon />}
									color={'red.500'}
									ml={2}
								/>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
};

export default CourseTable;
