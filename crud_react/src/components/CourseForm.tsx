import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Card,
	CardBody,
	Divider,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	IconButton,
	Input,
	Select,
	Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Category } from '../interfaces/category.enum';
import { Course } from '../interfaces/course';
import { CourseFormData } from '../interfaces/course-form-data';
import { Status } from '../interfaces/status.enum';

const emptyLesson = { name: '', youtube_url: '' };

interface CourseFormProps {
	initialData?: Course;
	onSubmit: (data: Course) => Promise<Course>;
	isLoading: boolean;
}

const CourseForm = ({ initialData, onSubmit, isLoading }: CourseFormProps) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<CourseFormData>({
		name: '',
		category: Category.BACKEND,
		status: Status.ACTIVE,
		lessons: [emptyLesson],
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				id: initialData.id,
				name: initialData.name,
				category: initialData.category,
				status: initialData.status,
				lessons: initialData.lessons.map((lesson) => ({
					id: lesson.id,
					name: lesson.name,
					youtube_url: lesson.youtube_url,
				})),
			});
		}
	}, [initialData]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleLessonChange = (index: number, field: keyof typeof emptyLesson, value: string) => {
		const updatedLessons = [...formData.lessons];
		updatedLessons[index][field] = value;
		setFormData({ ...formData, lessons: updatedLessons });
	};

	const removeLesson = (index: number) => {
		const updatedLessons = formData.lessons.filter((_, i) => i !== index);
		setFormData({ ...formData, lessons: updatedLessons });
	};

	const addLesson = () => {
		const newLesson = { ...emptyLesson };
		emptyLesson.name = '';
		emptyLesson.youtube_url = '';
		setFormData((prevData) => ({
			...prevData,
			lessons: [...prevData.lessons, newLesson],
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const courseData: Course = {
			...formData,
			lessons: formData.lessons.map((lesson) => ({
				...lesson,
				youtube_url: lesson.youtube_url.trim(),
			})),
		};

		onSubmit(courseData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardBody>
					<Stack spacing={6}>
						<Stack spacing={4}>
							<FormControl>
								<FormLabel>Course name</FormLabel>
								<Input
									value={formData.name}
									onChange={handleInputChange}
									name='name'
									placeholder='Course name'
									type='text'
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Category</FormLabel>
								<Select
									value={formData.category}
									onChange={handleInputChange}
									name='category'
									placeholder='Select option'>
									{Object.values(Category).map((category) => (
										<option
											key={category}
											value={category}>
											{category}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel>Status</FormLabel>
								<Select
									value={formData.status}
									onChange={handleInputChange}
									name='status'
									placeholder='Select option'>
									{Object.values(Status).map((status) => (
										<option
											key={status}
											value={status}>
											{status}
										</option>
									))}
								</Select>
							</FormControl>
						</Stack>

						<Divider />

						<Box>
							<Heading
								size='md'
								mb={2}>
								Lessons
							</Heading>

							{formData.lessons.map((lesson, index) => (
								<Box key={index}>
									<Stack>
										<FormControl mb={2}>
											<FormLabel>Lesson name</FormLabel>
											<Input
												value={lesson.name}
												onChange={(e) => handleLessonChange(index, 'name', e.target.value)}
												name='name'
												placeholder='Lesson name'
												type='text'
											/>
										</FormControl>

										<FormControl mb={2}>
											<FormLabel>YouTube URL</FormLabel>
											<Input
												value={lesson.youtube_url}
												onChange={(e) => handleLessonChange(index, 'youtube_url', e.target.value)}
												name='youtube_url'
												placeholder='YouTube URL'
												type='text'
											/>
										</FormControl>

										{formData.lessons.length > 1 && (
											<Box textAlign='right'>
												<IconButton
													aria-label='Delete lesson'
													icon={<DeleteIcon />}
													colorScheme='red'
													size='sm'
													onClick={() => removeLesson(index)}
												/>
											</Box>
										)}
									</Stack>
								</Box>
							))}
							<Button
								leftIcon={<AddIcon />}
								onClick={addLesson}
								colorScheme='blue'
								variant='outline'
								size='sm'
								mb={6}>
								Add Lesson
							</Button>
						</Box>

						<HStack
							justifyContent='flex-end'
							spacing={4}>
							<Button
								variant='outline'
								onClick={() => navigate('/')}>
								Cancel
							</Button>
							<Button
								type='submit'
								colorScheme='blue'
								isLoading={isLoading}
								loadingText='Saving...'>
								Save
							</Button>
						</HStack>
					</Stack>
				</CardBody>
			</Card>
		</form>
	);
};

export default CourseForm;
