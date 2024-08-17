const Filter = ({ filterTerm, onFilterChange }) => {
	return (
		<div>
			filter shown with <input type={filterTerm} onChange={onFilterChange} />
		</div>
	);
};

export default Filter;
