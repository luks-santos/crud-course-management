import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Card, CardBody, Divider, FormControl, FormLabel, Heading, HStack, IconButton, Select, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Category } from '../../models/enums/category.enum';
import { Status } from '../../models/enums/status.enum';
import { Course } from '../../models/interfaces/course';
import { CourseFormData } from '../../models/interfaces/course-form-data';
import InputComponent from '../../shared/input';

const emptyLesson = { name: '', youtube_url: '' };

interface CourseFormProps {
	initialData?: Course;
	onSubmit: (data: Course) => Promise<Course>;
	isLoading: boolean;
}

const CourseFormComponent = ({ initialData, onSubmit, isLoading }: CourseFormProps) => {
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

	const handCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
							<InputComponent
								name='name'
								label='Course Name'
								value={formData.name}
								handleOnChangeValue={handCourseChange}
								type='text'
								isRequired
							/>

							<FormControl isRequired>
								<FormLabel>Category</FormLabel>
								<Select
									value={formData.category}
									onChange={handCourseChange}
									name='category'
									placeholder='Select option'
								>
									{Object.values(Category).map((category) => (
										<option
											key={category}
											value={category}
										>
											{category}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Status</FormLabel>
								<Select
									value={formData.status}
									onChange={handCourseChange}
									name='status'
									placeholder='Select option'
								>
									{Object.values(Status).map((status) => (
										<option
											key={status}
											value={status}
										>
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
								mb={2}
							>
								Lessons
							</Heading>

							{formData.lessons.map((lesson, index) => (
								<Box key={index}>
									<Stack>
										<InputComponent
											name={`lesson-${index}-name`}
											label='Lesson Name'
											value={lesson.name}
											handleOnChangeValue={(e) => handleLessonChange(index, 'name', e.target.value)}
											type='text'
											isRequired
										/>
										<InputComponent
											name={`lesson-${index}-youtube_url`}
											label='YouTube URL'
											value={lesson.youtube_url}
											handleOnChangeValue={(e) => handleLessonChange(index, 'youtube_url', e.target.value)}
											type='text'
											isRequired
										/>
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
								my={1}
							>
								Add Lesson
							</Button>
						</Box>

						<HStack
							justifyContent='flex-end'
							spacing={4}
						>
							<Button
								variant='outline'
								onClick={() => navigate('/')}
							>
								Cancel
							</Button>
							<Button
								type='submit'
								colorScheme='blue'
								isLoading={isLoading}
								loadingText='Saving...'
							>
								Save
							</Button>
						</HStack>
					</Stack>
				</CardBody>
			</Card>
		</form>
	);
};

export default CourseFormComponent;
