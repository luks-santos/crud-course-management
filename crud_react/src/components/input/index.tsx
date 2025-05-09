import { FormControl, FormControlProps, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

interface InputComponentProps extends FormControlProps {
	name: string;
	label: string;
	formErrorMessage?: string;
	handleOnChangeValue: (event: ChangeEvent<HTMLInputElement>) => void;
	isError?: boolean;
	type?: HTMLInputTypeAttribute;
	value?: string;
	isRequired?: boolean;
}

const InputComponent: React.FC<InputComponentProps> = ({
	name = '',
	label = '',
	handleOnChangeValue = () => {
		throw 'handleOnChangeValue function not implemented';
	},
	formErrorMessage = '',
	isError = false,
	type = 'text',
	value = '',
	isRequired = false,
	...args
}) => {
	return (
		<FormControl
			isRequired={isRequired}
			isInvalid={isRequired ? isError : false}
			{...args}
		>
			<FormLabel>{label}</FormLabel>
			<Input
				name={name}
				variant='outline'
				type={type}
				onChange={handleOnChangeValue}
				value={value}
			/>
			{isError && <FormErrorMessage>{formErrorMessage}</FormErrorMessage>}
		</FormControl>
	);
};

export default InputComponent;
