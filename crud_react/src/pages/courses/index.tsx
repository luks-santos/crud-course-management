import { useState } from 'react';
import { useParams } from 'react-router';
import CourseFormComponent from '../../components/course-form';
import { useToastNotifier } from '../../hooks/useToastNotifier';
import useHttp from '../../hooks/utils/useHttp';
import { Course } from '../../models/interfaces/course';
import { CourseFormData } from '../../models/interfaces/course-form-data';
import Layout from '../../templates/layout';

const CoursesPage = () => {
	const { id } = useParams();
	const { data } = useHttp<Course>(id ? `${import.meta.env.VITE_API_URL}/courses/${id}` : '', 'GET', null, [id], !!id);
	const urlRequest = id ? `${import.meta.env.VITE_API_URL}/courses/${id}` : `${import.meta.env.VITE_API_URL}/courses`;
	const { sendRequest } = useHttp<Course>(urlRequest, id ? 'PUT' : 'POST', null, [], false);
	const [loading, setLoading] = useState(false);
	const { showToast } = useToastNotifier();

	const handleSubmit = async (data: CourseFormData): Promise<Course> => {
		setLoading(true);
		try {
			const response = await sendRequest({ body: data });
			showToast({
				title: id ? 'Course updated' : 'Course created',
				description: id ? 'The course has been successfully updated.' : 'The course has been successfully created.',
				status: 'success',
			});
			return response;
		} catch (error) {
			showToast({
				title: id ? 'Error updating course' : 'Error creating course',
				description: id
					? 'An error occurred while updating the course. Please try again later.'
					: 'An error occurred while creating the course. Please try again later.',
				status: 'error',
			});
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<CourseFormComponent
				initialData={data!}
				onSubmit={handleSubmit}
				isLoading={loading}
			></CourseFormComponent>
		</Layout>
	);
};

export default CoursesPage;
