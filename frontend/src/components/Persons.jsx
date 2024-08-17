const DeleteButton = ({ id, onDelete }) => (
	<button onClick={() => onDelete(id)}>delete</button>
);

const PersonLine = ({ person, onDelete }) => (
	<p>
		{person.name} {person.number}{" "}
		<DeleteButton key={person.id} onDelete={onDelete} id={person.id} />
	</p>
);

const Persons = ({ persons, onDelete }) => {
	return persons.map((person) => (
		<PersonLine key={person.id} person={person} onDelete={onDelete} />
	));
};

export default Persons;
