import { ArrowBackIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/layout';
import { Badge, Button, Card, CardBody, Heading, useColorModeValue } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router';
import { Status } from '../../models/enums/status.enum';
import { Course } from '../../models/interfaces/course';
import Layout from '../../shared/layout';

const CoursesViewPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const course = location.state?.course as Course | undefined;

	const getStatusColor = (status: Status) => {
		return status === Status.ACTIVE ? 'green' : 'red';
	};

	if (!course) {
		return (
			<Layout>
				<Flex
					justify='center'
					align='center'
					py={10}
				>
					<Box>
						<Text>Course not found</Text>
					</Box>
				</Flex>
			</Layout>
		);
	}
	return (
		<Layout>
			<Flex
				mt={2}
				justify='start'
				align='center'
			>
				<Box>
					<Button
						leftIcon={<ArrowBackIcon />}
						colorScheme='blue'
						variant={'ghost'}
						onClick={() => navigate('/courses')}
					>
						Back to Courses
					</Button>
				</Box>
			</Flex>

			<Box
				px={5}
				py={3}
			>
				<Heading as='h1'>{course.name}</Heading>
				<Badge
					mr={3}
					colorScheme={getStatusColor(course.status)}
				>
					{course.status}
				</Badge>
				<Badge>{course.category}</Badge>
			</Box>

			<Grid
				px={5}
				templateColumns='3fr 1fr'
				gap={6}
			>
				<GridItem>
					<Card height='100%'>
						<CardBody>
							<Heading size='md'>Description</Heading>

							<Text py='2'>Caffè latte is a coffee beverage of Italian origin made with espresso and steamed milk.</Text>

							<Flex
								justify='left'
								align='center'
								color={'gray.500'}
								gap={4}
							>
								<Box
									display='flex'
									gap={2}
								>
									<CalendarIcon />
									<Text fontSize='sm'>Created at: {new Date(Date.now()).toLocaleString()}</Text>
								</Box>
								<Box
									display='flex'
									gap={2}
								>
									<InfoIcon />

									<Text fontSize='sm'>Category: {course.category}</Text>
								</Box>
							</Flex>
						</CardBody>
					</Card>
				</GridItem>
				<GridItem>
					<Card height='100%'>
						<CardBody>
							<Heading size='md'>Information</Heading>
							<Grid
								templateColumns='1fr 1fr'
								gap={4}
								py={2}
							>
								<GridItem color={useColorModeValue('gray.500', 'gray.400')}>
									<Text fontSize='sm'>Status: </Text>
									<Text fontSize='sm'>Category: </Text>
									<Text fontSize='sm'>Lessons: </Text>
									<Text fontSize='sm'>Updated At: </Text>
								</GridItem>
								<GridItem>
									<Text fontSize='sm'>{course.status}</Text>
									<Text fontSize='sm'>{course.category}</Text>
									<Text fontSize='sm'>{course.lessons.length}</Text>
									{/* <Text fontSize='sm'>{course.lessons.length}</Text> */}
								</GridItem>
							</Grid>
						</CardBody>
					</Card>
				</GridItem>
			</Grid>

			<Box
				px={5}
				py={3}
			>
				<Card
					height='100%'
					variant='elevated'
				>
					<CardBody>
						<Heading size='md'>Lessons</Heading>

						{course.lessons.length > 0 ? (
							course.lessons.map((lesson, index) => {
								const number = index + 1;
								return (
									<Card
										key={lesson.id}
										direction={{ base: 'column', sm: 'row' }}
										overflow='hidden'
										variant='outline'
										my='2'
										align='center'
										px='2'
									>
										<Flex
											align='center'
											justify='center'
											borderRadius='full'
											bg={useColorModeValue('gray.100', 'gray.400')}
											color={useColorModeValue('gray.700', 'gray.200')}
											w='36px'
											h='36px'
											fontSize='lg'
											fontWeight='bold'
										>
											{number}
										</Flex>

										<CardBody>
											<Flex align='center'>
												<Heading size='sm'>{lesson.name}</Heading>
												<Button
													ml='auto'
													colorScheme='blue'
													size='sm'
													onClick={() => navigate(`/courses/${course.id}/lessons/${lesson.id}`, { state: { lesson } })}
												>
													Watch Lesson
												</Button>
											</Flex>
										</CardBody>
									</Card>
								);
							})
						) : (
							<Text>No lessons available</Text>
						)}
					</CardBody>
				</Card>
			</Box>
		</Layout>
	);
};

export default CoursesViewPage;
