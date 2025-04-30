import { useState } from 'react';
import { useNavigate } from 'react-router';
import CourseForm from '../components/CourseForm';
import Layout from '../components/Layout';
import useHttp from '../hooks/useHttp';
import { Course } from '../interfaces/course';

const CourseCreate = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { sendRequest } = useHttp<Course>(`${import.meta.env.VITE_API_URL}/courses`, 'POST', null, [], false);

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
				onSubmit={handleSubmit}
				isLoading={loading}></CourseForm>
		</Layout>
	);
};

export default CourseCreate;
