import Courses from '../../pages/Courses';
import CoursesList from '../../pages/CoursesList';

interface RouteProps {
	path: string;
	element: React.FC;
}

const routesList: RouteProps[] = [
	{ path: '/course', element: CoursesList },
	{ path: '/course/create', element: Courses },
	{ path: '/course/:id', element: Courses },

	{ path: '*', element: CoursesList },
];

export default routesList;
