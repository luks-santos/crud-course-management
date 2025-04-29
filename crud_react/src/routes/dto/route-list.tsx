import CourseList from '../../pages/CourseList';

interface RouteProps {
	path: string;
	element: React.FC;
}

const routesList: RouteProps[] = [{ path: '/', element: CourseList }];

export default routesList;
