import axios, { AxiosResponse, Method } from 'axios';
import { useEffect, useReducer } from 'react';

interface HttpState<T> {
	loading: boolean;
	data: T | null;
	error: string | null;
}

type HttpAction<T> = { type: 'SEND' } | { type: 'SUCCESS'; responseData: T } | { type: 'ERROR'; errorMessage: string };

const httpReducer = <T,>(state: HttpState<T>, action: HttpAction<T>): HttpState<T> => {
	switch (action.type) {
		case 'SEND':
			return { data: null, error: null, loading: true };
		case 'SUCCESS':
			return { data: action.responseData, error: null, loading: false };
		case 'ERROR':
			return { data: null, error: action.errorMessage, loading: false };
		default:
			return state;
	}
};

const useHttp = <T,>(url: string, method: Method = 'GET', body: any = null, dependencies: any[] = []): HttpState<T> => {
	const [httpState, dispatch] = useReducer(httpReducer<T>, {
		loading: false,
		data: null,
		error: null,
	});

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'SEND' });
			try {
				const response: AxiosResponse<T> = await axios({
					url,
					method,
					data: body,
				});
				dispatch({ type: 'SUCCESS', responseData: response.data });
			} catch (error) {
				dispatch({
					type: 'ERROR',
					errorMessage: axios.isAxiosError(error) ? error.message : 'Algo deu errado!',
				});
			}
		};
		fetchData();
	}, dependencies);

	return httpState;
};

export default useHttp;
