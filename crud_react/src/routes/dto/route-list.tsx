import CourseCreate from '../../pages/CourseCreate';
import CourseEdit from '../../pages/CourseEdit';
import CourseList from '../../pages/CourseList';

interface RouteProps {
	path: string;
	element: React.FC;
}

const routesList: RouteProps[] = [
	{ path: '/', element: CourseList },
	{ path: '/course/create', element: CourseCreate },
	{ path: '/course/:id', element: CourseEdit },
];

export default routesList;
