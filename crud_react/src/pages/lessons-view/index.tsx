import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/layout';
import { Button, Heading } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router';
import { Lesson } from '../../models/interfaces/lesson';
import Layout from '../../templates/layout';

const LessonViewPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const lesson = location.state?.lesson as Lesson | undefined;

	const getYouTubeVideoId = (url: string) => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	};
	const videoId = lesson ? getYouTubeVideoId(lesson.youtube_url) : null;

	if (!lesson) {
		return (
			<Layout>
				<Flex
					justify='center'
					align='center'
					py={10}
				>
					<Box>
						<Text>Lesson not found</Text>
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
						onClick={() => navigate(-1)}
					>
						Back to course
					</Button>
				</Box>
			</Flex>

			<Grid
				templateColumns='5fr'
				gap={6}
				px={5}
				py={3}
			>
				<GridItem className='w-full h-full'>
					<Box
						bg='black'
						position='relative'
						height='60vh'
						width='100%'
					>
						{videoId && (
							<iframe
								src={`https://www.youtube.com/embed/${videoId}?autoplay=1&`}
								title={lesson.name}
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;'
								allowFullScreen
								className='w-full h-full'
								style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
							></iframe>
						)}
					</Box>
					<Box mt={4}>
						<Heading size='md'>{lesson.name}</Heading>
					</Box>
				</GridItem>
			</Grid>
		</Layout>
	);
};

export default LessonViewPage;
