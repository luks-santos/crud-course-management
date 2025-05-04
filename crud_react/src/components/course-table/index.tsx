import { DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import {
	Badge,
	Flex,
	Heading,
	IconButton,
	Spinner,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useHttp from '../../hooks/utils/useHttp';
import { Status } from '../../models/enums/status.enum';
import { Course } from '../../models/interfaces/course';
import ModalDeleteConfirm from '../../shared/modal-delete-confirm';

interface CourseTableProps {
	courses: Course[] | null;
	isLoading: boolean;
	onUpdateTable: () => void;
}

const CourseTableComponent = ({ courses, isLoading, onUpdateTable }: CourseTableProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [courseDeleteId, setCourseDeleteId] = useState<number | null>(null);
	const { sendRequest, loading } = useHttp<Course>(`${import.meta.env.VITE_API_URL}/courses/${courseDeleteId}`, 'DELETE', null, [], false);
	const navigate = useNavigate();

	const handleDelete = (courseId: number) => {
		setCourseDeleteId(courseId);
		onOpen();
	};

	const confirmDelete = async () => {
		if (courseDeleteId) {
			try {
				await sendRequest();
				onClose();
				setCourseDeleteId(null);
				onUpdateTable();
			} catch (error) {
				console.error('Error deleting course:', error);
			}
		}
	};

	if (!courses || courses.length === 0) {
		return (
			<Flex
				justify='center'
				align='center'
				py={10}
			>
				<Heading
					size='lg'
					color='gray.500'
				>
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
				py={10}
			>
				<Spinner size='xl' />
			</Flex>
		);
	}

	const getStatusColor = (status: Status) => {
		return status === Status.ACTIVE ? 'green' : 'red';
	};

	const handleViewCourse = (course: Course) => {
		navigate(`/courses/${course.id}`, {
			state: { course },
		});
	};
	return (
		<>
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
									<Badge>{course.category}</Badge>
								</Td>
								<Td>
									<Badge colorScheme={getStatusColor(course.status)}>{course.status}</Badge>
								</Td>
								<Td>{course.lessons.length}</Td>
								<Td textAlign={'right'}>
									<IconButton
										onClick={() => handleViewCourse(course)}
										aria-label='View course'
										icon={<ViewIcon />}
										color={'blue.500'}
									/>
									<IconButton
										onClick={() => navigate(`/courses/${course.id}/edit`)}
										aria-label='Edit course'
										icon={<EditIcon />}
										color={'blue.500'}
										mx={2}
									/>
									<IconButton
										onClick={() => handleDelete(course.id!)}
										aria-label='Delete course'
										icon={<DeleteIcon />}
										color={'red.500'}
									/>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
			<ModalDeleteConfirm
				isOpen={isOpen}
				onClose={onClose}
				onConfirm={confirmDelete}
				title='Delete Course'
				message='Are you sure you want to delete this course? This action cannot be undone.'
				isLoading={loading}
			/>
		</>
	);
};

export default CourseTableComponent;
