import { Navigate } from 'react-router';
import CoursesPage from '../pages/courses';
import CoursesListPage from '../pages/courses-list';
import CoursesViewPage from '../pages/courses-view';
import LessonViewPage from '../pages/lessons-view';

interface RouteProps {
	path: string;
	element: React.ReactNode;
}

const routesList: RouteProps[] = [
	{ path: '/courses', element: <CoursesListPage /> },
	{ path: '/courses/create', element: <CoursesPage /> },
	{ path: '/courses/:id/edit', element: <CoursesPage /> },
	{ path: '/courses/:id', element: <CoursesViewPage /> },
	{ path: '/courses/:id/lessons/:lessonId', element: <LessonViewPage /> },
	{
		path: '*',
		element: (
			<Navigate
				to='/courses'
				replace
			/>
		),
	},
];

export default routesList;
