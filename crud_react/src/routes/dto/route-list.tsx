import CourseCreate from '../../pages/CourseCreate';
import CourseList from '../../pages/CourseList';

interface RouteProps {
	path: string;
	element: React.FC;
}

const routesList: RouteProps[] = [
	{ path: '/', element: CourseList },
	{ path: '/course/create', element: CourseCreate },
];

export default routesList;
