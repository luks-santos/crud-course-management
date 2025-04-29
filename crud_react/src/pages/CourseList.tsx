import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import CourseTable from '../components/CourseTable';
import Layout from '../components/Layout';
import useHttp from '../hooks/useHttp';
import { Course } from '../interfaces/course';

const CourseList = () => {
	const { data: courses, loading } = useHttp<Course[]>(`${import.meta.env.VITE_API_URL}/courses`, 'GET');

	console.log(courses);
	return (
		<Layout>
			<Flex
				justify='end'
				align='center'
				mb={6}>
				<Box>
					<Button
						leftIcon={<AddIcon />}
						colorScheme='blue'>
						Novo Curso
					</Button>
				</Box>
			</Flex>

			<CourseTable
				courses={courses}
				isLoading={loading}
			/>
		</Layout>
	);
};

export default CourseList;
