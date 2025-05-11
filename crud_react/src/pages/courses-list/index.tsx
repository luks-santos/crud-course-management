import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import CourseTableComponent from '../../components/course-table';
import { useToastNotifier } from '../../hooks/useToastNotifier';
import useHttp from '../../hooks/utils/useHttp';
import { Course } from '../../models/interfaces/course';
import { Pagination } from '../../models/interfaces/pagination';
import Layout from '../../templates/layout';

const CoursesListPage = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);

	const { data, loading, sendRequest } = useHttp<Pagination<Course>>(
		`${import.meta.env.VITE_API_URL}/courses/paginated?page=${page}&per_page=${pageSize}`,
		'GET',
		null,
		[page, pageSize]
	);
	const { showToast } = useToastNotifier();

	const handleUpdateTable = async () => {
		try {
			await sendRequest();
		} catch (error) {
			showToast({
				title: 'Error loading courses',
				description: 'An error occurred while loading the courses. Please try again later.',
				status: 'error',
			});
			throw error;
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
						courses={data}
						isLoading={loading}
						onUpdateTable={handleUpdateTable}
						goToPage={setPage}
						setPageSize={setPageSize}
					/>
				</CardBody>
			</Card>
		</Layout>
	);
};

export default CoursesListPage;
