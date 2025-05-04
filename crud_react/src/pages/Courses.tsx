import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CourseForm from '../components/CourseForm';
import Layout from '../components/Layout';
import useHttp from '../hooks/useHttp';
import { Course } from '../models/interfaces/course';

const Courses = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { data } = useHttp<Course>(id ? `${import.meta.env.VITE_API_URL}/courses/${id}` : '', 'GET', null, [id], !!id);
	const [loading, setLoading] = useState(false);

	const urlRequest = id ? `${import.meta.env.VITE_API_URL}/courses/${id}` : `${import.meta.env.VITE_API_URL}/courses`;
	const { sendRequest } = useHttp<Course>(urlRequest, id ? 'PUT' : 'POST', null, [], false);

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
				isLoading={loading}></CourseForm>
		</Layout>
	);
};

export default Courses;
