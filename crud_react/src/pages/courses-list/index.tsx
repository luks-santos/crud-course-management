import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import CourseTableComponent from '../../components/course-table';
import useHttp from '../../hooks/utils/useHttp';
import { Course } from '../../models/interfaces/course';
import Layout from '../../templates/layout';

const CoursesListPage = () => {
	const navigate = useNavigate();
	const { data: courses, loading, sendRequest } = useHttp<Course[]>(`${import.meta.env.VITE_API_URL}/courses`, 'GET');

	const handleUpdateTable = async () => {
		try {
			await sendRequest();
		} catch (error) {
			console.error('Error fetching courses:', error);
		}
	};

	const handleAddCourse = () => {
		navigate('/courses/create');
	};

	return (
		<Layout>
			<Flex
				justify='end'
				align='center'
				mb={2}
			>
				<Box>
					<Button
						onClick={handleAddCourse}
						leftIcon={<AddIcon />}
						colorScheme='blue'
					>
						Add Course
					</Button>
				</Box>
			</Flex>

			<Card>
				<CardBody>
					<CourseTableComponent
						courses={courses}
						isLoading={loading}
						onUpdateTable={handleUpdateTable}
					/>
				</CardBody>
			</Card>
		</Layout>
	);
};

export default CoursesListPage;
