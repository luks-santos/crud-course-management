import { Route, Routes } from 'react-router';
import routesList from './route-list';

const AppRoutes = () => {
	return (
		<>
			<Routes>
				{routesList.map((route) => {
					return (
						<Route
							key={route.path}
							path={route.path}
							element={route.element}
						/>
					);
				})}
			</Routes>
		</>
	);
};

export default AppRoutes;
