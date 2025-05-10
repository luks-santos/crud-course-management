import axios, { AxiosResponse, Method } from 'axios';
import { useCallback, useEffect, useReducer } from 'react';

interface HttpState<T> {
	loading: boolean;
	data: T | null;
	error: string | null;
}
type HttpAction<T> = { type: 'send' } | { type: 'success'; responseData: T } | { type: 'error'; error: string };

const httpReducer = <T,>(state: HttpState<T>, action: HttpAction<T>): HttpState<T> => {
	switch (action.type) {
		case 'send':
			return { ...state, loading: true, error: null };
		case 'success':
			return { data: action.responseData, error: null, loading: false };
		case 'error':
			return { ...state, error: action.error, loading: false };
		default:
			return state;
	}
};

interface UseHttpResult<T> {
	loading: boolean;
	data: T | null;
	error: string | null;
	sendRequest: (config?: { url?: string; method?: Method; body?: any }) => Promise<T>;
}

/**
 * HTTP request hook
 * @param url Base URL for the request
 * @param method HTTP method
 * @param body Request body (optional)
 * @param dependencies Dependency array for useEffect
 * @param runOnMount If true, executes the request when the component mounts
 */
const useHttp = <T,>(
	url: string,
	method: Method = 'GET',
	body: any = null,
	dependencies: any[] = [],
	runOnMount: boolean = true
): UseHttpResult<T> => {
	const [httpState, dispatch] = useReducer(httpReducer<T>, {
		loading: false,
		data: null,
		error: null,
	});

	const sendRequest = useCallback(
		async (config?: { url?: string; method?: Method; body?: any }): Promise<T> => {
			try {
				dispatch({ type: 'send' });
				const response: AxiosResponse<T> = await axios({
					url: config?.url || url,
					method: config?.method || method,
					data: config?.body !== undefined ? config.body : body,
					headers: {
						'Content-Type': 'application/json',
					},
				});
				dispatch({ type: 'success', responseData: response.data });
				return response.data;
			} catch (error) {
				let errorMessage = 'An error occurred';
				if (axios.isAxiosError(error)) {
					errorMessage = error.response?.data?.message || error.message;
					console.error('Axios error:', error.response?.data || error.message);
				} else if (error instanceof Error) {
					errorMessage = error.message;
					console.error('Error:', error.message);
				}

				dispatch({ type: 'error', error: errorMessage });
				throw error;
			}
		},
		[url, method, body]
	);

	useEffect(() => {
		if (runOnMount) {
			sendRequest().catch((error) => {
				console.error('Error in automatic request:', error);
			});
		}
	}, dependencies);

	return {
		loading: httpState.loading,
		data: httpState.data,
		error: httpState.error,
		sendRequest,
	};
};

export default useHttp;
