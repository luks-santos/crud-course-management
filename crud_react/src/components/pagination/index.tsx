import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/layout';
import {
	IconButton,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Tooltip,
} from '@chakra-ui/react';
import { useState } from 'react';

interface PaginationComponentProps {
	pageIndex: number;
	pageSize: number;
	totalPages: number;
	canPreviousPage: boolean;
	canNextPage: boolean;
	goToPage: (page: number) => void;
	setPageSize: (pageSize: number) => void;
}

const PaginationComponent = ({
	pageIndex,
	pageSize,
	totalPages,
	canPreviousPage,
	canNextPage,
	goToPage,
	setPageSize,
}: PaginationComponentProps) => {
	const [inputPageIndex, setInputPageIndex] = useState(pageIndex);

	const previousPage = () => {
		goToPage(pageIndex - 1);
	};
	const nextPage = () => {
		goToPage(pageIndex + 1);
	};
	return (
		<Flex
			justifyContent='space-between'
			m={4}
			alignItems='center'
		>
			<Flex alignItems='center'>
				<Text
					flexShrink='0'
					mr={8}
				>
					Page{' '}
					<Text
						fontWeight='bold'
						as='span'
					>
						{pageIndex}
					</Text>{' '}
					of{' '}
					<Text
						fontWeight='bold'
						as='span'
					>
						{totalPages}
					</Text>
				</Text>
			</Flex>

			<Flex>
				<Tooltip label='First Page'>
					<IconButton
						aria-label={''}
						onClick={() => goToPage(0)}
						isDisabled={!canPreviousPage}
						icon={
							<ArrowLeftIcon
								h={3}
								w={3}
							/>
						}
						mr={4}
					/>
				</Tooltip>
				<Tooltip label='Previous Page'>
					<IconButton
						aria-label={''}
						onClick={previousPage}
						isDisabled={!canPreviousPage}
						icon={
							<ChevronLeftIcon
								h={6}
								w={6}
							/>
						}
					/>
				</Tooltip>

				<Flex
					alignItems='center'
					mx={1}
				>
					<Text flexShrink='0'>Go to:</Text>{' '}
					<NumberInput
						ml={2}
						mr={8}
						w={28}
						min={1}
						max={totalPages}
						onChange={(valueString) => {
							const value = Number(valueString);
							if (value >= 1 && value <= totalPages) {
								setInputPageIndex(value);
							}
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								const value = Number(inputPageIndex);
								goToPage(value);
							}
						}}
						defaultValue={pageIndex}
					>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</Flex>
				<Flex>
					<Tooltip label='Next Page'>
						<IconButton
							aria-label={''}
							onClick={nextPage}
							isDisabled={!canNextPage}
							icon={
								<ChevronRightIcon
									h={6}
									w={6}
								/>
							}
						/>
					</Tooltip>
					<Tooltip label='Last Page'>
						<IconButton
							aria-label={''}
							onClick={() => goToPage(totalPages - 1)}
							isDisabled={!canNextPage}
							icon={
								<ArrowRightIcon
									h={3}
									w={3}
								/>
							}
							ml={4}
						/>
					</Tooltip>
				</Flex>
			</Flex>

			<Flex>
				<Select
					w={32}
					value={pageSize}
					onChange={(e) => {
						setPageSize(Number(e.target.value));
					}}
				>
					{[5, 10, 20, 30, 40, 50].map((pageSize) => (
						<option
							key={pageSize}
							value={pageSize}
						>
							Show {pageSize}
						</option>
					))}
				</Select>
			</Flex>
		</Flex>
	);
};

export default PaginationComponent;
