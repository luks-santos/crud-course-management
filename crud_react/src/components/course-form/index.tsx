import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Flex, Grid, GridItem } from '@chakra-ui/layout';
import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	IconButton,
	Input,
	Select,
	Stack,
	Tag,
	Textarea,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Category } from '../../models/enums/category.enum';
import { Status } from '../../models/enums/status.enum';
import { Course } from '../../models/interfaces/course';
import { CourseFormData } from '../../models/interfaces/course-form-data';

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

	const tagColorScheme = {
		[Status.ACTIVE]: 'green',
		[Status.INACTIVE]: 'danger',
	};
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const lessonBg = useColorModeValue('gray.50', 'gray.700');

	useEffect(() => {
		if (initialData) {
			setFormData({
				id: initialData.id,
				name: initialData.name,
				description: initialData.description,
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

	const handleFormCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFormLessonChange = (index: number, field: keyof typeof emptyLesson, value: string) => {
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
			<Card
				bg={cardBg}
				shadow='md'
				borderRadius='lg'
				overflow='hidden'
				borderColor={borderColor}
				borderWidth='1px'
			>
				<CardHeader
					bg='blue.500'
					py={4}
				>
					<Heading
						size='md'
						color='white'
					>
						{initialData ? 'Edit Course' : 'Create New Course'}
					</Heading>
				</CardHeader>

				<CardBody p={6}>
					<VStack
						spacing={8}
						align='stretch'
					>
						<Box>
							<Heading
								size='sm'
								mb={4}
								color='blue.600'
							>
								Course Details
							</Heading>

							<Grid
								templateColumns={{ base: '1fr', md: '1fr 1fr' }}
								gap={6}
							>
								<GridItem colSpan={{ base: 1, md: 2 }}>
									<FormControl isRequired>
										<FormLabel fontWeight='medium'>Course Name</FormLabel>
										<Input
											name='name'
											value={formData.name}
											onChange={handleFormCourseChange}
											placeholder='Enter course name'
											size='md'
											borderRadius='md'
											focusBorderColor='blue.400'
										/>
									</FormControl>
								</GridItem>

								<GridItem colSpan={{ base: 1, md: 2 }}>
									<FormControl>
										<FormLabel fontWeight='medium'>Description</FormLabel>
										<Textarea
											name='description'
											value={formData.description}
											onChange={handleFormCourseChange}
											placeholder='Enter course description'
											size='md'
											borderRadius='md'
											focusBorderColor='blue.400'
											rows={3}
											resize='vertical'
										/>
									</FormControl>
								</GridItem>

								<GridItem>
									<FormControl isRequired>
										<FormLabel fontWeight='medium'>Category</FormLabel>
										<Select
											name='category'
											value={formData.category}
											onChange={handleFormCourseChange}
											borderRadius='md'
											focusBorderColor='blue.400'
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
								</GridItem>

								<GridItem>
									<FormControl isRequired>
										<FormLabel fontWeight='medium'>Status</FormLabel>
										<Flex alignItems='center'>
											<Select
												name='status'
												value={formData.status}
												onChange={handleFormCourseChange}
												borderRadius='md'
												focusBorderColor='blue.400'
												mr={3}
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
											<Tag
												size='md'
												colorScheme={tagColorScheme[formData.status as Status] || 'gray'}
												borderRadius='full'
											>
												{formData.status}
											</Tag>
										</Flex>
									</FormControl>
								</GridItem>
							</Grid>
						</Box>

						<Divider />

						<Box>
							<Flex
								justify='space-between'
								align='center'
								mb={4}
							>
								<Heading
									size='sm'
									color='blue.600'
								>
									Lessons
								</Heading>
							</Flex>

							<VStack
								spacing={4}
								align='stretch'
							>
								{formData.lessons.map((lesson, index) => (
									<Card
										key={index}
										bg={lessonBg}
										borderRadius='md'
										borderWidth='1px'
										borderColor={borderColor}
										overflow='hidden'
									>
										<CardBody p={4}>
											<Grid
												templateColumns={{ base: '1fr', md: '1fr auto' }}
												gap={4}
											>
												<GridItem>
													<Stack spacing={4}>
														<FormControl isRequired>
															<FormLabel
																fontWeight='medium'
																fontSize='sm'
															>
																Lesson Name
															</FormLabel>
															<Input
																value={lesson.name}
																onChange={(e) => handleFormLessonChange(index, 'name', e.target.value)}
																placeholder='Enter lesson name'
																size='md'
																borderRadius='md'
																focusBorderColor='blue.400'
															/>
														</FormControl>

														<FormControl isRequired>
															<FormLabel
																fontWeight='medium'
																fontSize='sm'
															>
																YouTube URL
															</FormLabel>
															<Input
																value={lesson.youtube_url}
																onChange={(e) => handleFormLessonChange(index, 'youtube_url', e.target.value)}
																placeholder='Enter YouTube URL'
																size='md'
																borderRadius='md'
																focusBorderColor='blue.400'
															/>
														</FormControl>
													</Stack>
												</GridItem>

												<GridItem>
													{formData.lessons.length > 1 && (
														<IconButton
															aria-label='Remove lesson'
															icon={<DeleteIcon />}
															colorScheme='red'
															variant='ghost'
															size='sm'
															onClick={() => removeLesson(index)}
															alignSelf='flex-start'
															mt={{ base: 0, md: 8 }}
														/>
													)}
												</GridItem>
											</Grid>
										</CardBody>
									</Card>
								))}

								<Button
									leftIcon={<AddIcon />}
									onClick={addLesson}
									colorScheme='blue'
									variant='outline'
									size='md'
									borderRadius='md'
									width='full'
								>
									Add Lesson
								</Button>
							</VStack>
						</Box>

						<Divider />

						<HStack
							spacing={4}
							justify='flex-end'
						>
							<Button
								variant='outline'
								onClick={() => navigate('/courses')}
								size='md'
								borderRadius='md'
							>
								Cancel
							</Button>
							<Button
								type='submit'
								isLoading={isLoading}
								loadingText='Saving...'
								size='md'
								borderRadius='md'
								colorScheme='blue'
							>
								Save
							</Button>
						</HStack>
					</VStack>
				</CardBody>
			</Card>
		</form>
	);
};

export default CourseFormComponent;
