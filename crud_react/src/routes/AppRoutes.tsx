import { createElement } from 'react';
import { Route, Routes } from 'react-router';
import routesList from './dto/route-list';

const AppRoutes = () => {
	return (
		<>
			<Routes>
				{routesList.map((route) => {
					const element = createElement(route.element);
					return (
						<Route
							key={route.path}
							path={route.path}
							element={element}
						/>
					);
				})}
			</Routes>
		</>
	);
};

export default AppRoutes;
