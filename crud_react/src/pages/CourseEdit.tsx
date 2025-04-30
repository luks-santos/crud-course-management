import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CourseForm from '../components/CourseForm';
import Layout from '../components/Layout';
import useHttp from '../hooks/useHttp';
import { Course } from '../interfaces/course';

const CourseEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data } = useHttp<Course>(`${import.meta.env.VITE_API_URL}/courses/${id}`, 'GET', null, [], true);
	const { sendRequest } = useHttp<Course>(`${import.meta.env.VITE_API_URL}/courses/${id}`, 'PUT', null, [], false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (data: Course): Promise<Course> => {
		setLoading(true);
		try {
			const response = await sendRequest({ body: data });
			return response;
		} catch (error) {
			console.error('Error creating course:', error);
			throw error;
		} finally {
			setLoading(false);
			navigate('/');
		}
	};

	return (
		<Layout>
			<CourseForm
				initialData={data!}
				onSubmit={handleSubmit}
				isLoading={loading}
			/>
		</Layout>
	);
};

export default CourseEdit;
