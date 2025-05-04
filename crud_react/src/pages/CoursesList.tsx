import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import CourseTable from '../components/CourseTable';
import Layout from '../components/Layout';
import useHttp from '../hooks/useHttp';
import { Course } from '../models/interfaces/course';

const CoursesList = () => {
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
		navigate('/course/create');
	};

	return (
		<Layout>
			<Flex
				justify='end'
				align='center'
				mb={6}>
				<Box>
					<Button
						onClick={handleAddCourse}
						leftIcon={<AddIcon />}
						colorScheme='blue'>
						Add Course
					</Button>
				</Box>
			</Flex>

			<Card>
				<CardBody>
					<CourseTable
						courses={courses}
						isLoading={loading}
						onUpdateTable={handleUpdateTable}
					/>
				</CardBody>
			</Card>
		</Layout>
	);
};

export default CoursesList;
