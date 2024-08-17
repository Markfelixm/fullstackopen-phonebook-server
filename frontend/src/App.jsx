import { useState, useEffect } from "react";
import contactServices from "./services/contacts";
import Form from "./components/Form";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filterTerm, setFilterTerm] = useState("");
	const [notification, setNotification] = useState({
		message: null,
		color: "green",
	});

	const hook = () => {
		contactServices
			.getAll()
			.then((initialPersons) => setPersons(initialPersons));
	};

	useEffect(hook, []);

	const visiblePersons = persons.filter((person) =>
		person.name.toLowerCase().includes(filterTerm.toLocaleLowerCase())
	);

	const onNameChange = (event) => {
		setNewName(event.target.value);
	};

	const onNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const onFilterChange = (event) => {
		setFilterTerm(event.target.value);
	};

	const updateContact = (newContact) => {
		return; // exercise 3.9: disable changes to contacts
		contactServices
			.update(newContact)
			.then((updatedContact) => {
				const newPersons = persons.map((person) =>
					person.id !== updatedContact.id ? person : updatedContact
				);
				setPersons(newPersons);
				setNewName("");
				setNewNumber("");
				notify(
					`updated "${updatedContact.name}" with number "${updatedContact.number}"`,
					"green",
					4000
				);
			})
			.catch(() =>
				notify(`failed to update "${newContact.name}"`, "red", 5000)
			);
	};

	const addContact = (event) => {
		event.preventDefault();
		return; // exercise 3.9: disable changes to contacts

		const newContact = { name: newName, number: newNumber };

		const existingContact = persons.find((person) => person.name === newName);
		if (existingContact) {
			if (
				confirm(
					`${newName} is already added to phonebook, replace the old number with a new one?`
				)
			) {
				newContact.id = existingContact.id;
				updateContact(newContact);
			}
		} else {
			contactServices
				.create(newContact)
				.then((createdPerson) => {
					setPersons([...persons].concat(createdPerson));
					setNewName("");
					setNewNumber("");
					notify(`added "${createdPerson.name}"`, "green", 4000);
				})
				.catch(() =>
					notify(`failed to create "${newContact.name}"`, "red", 5000)
				);
		}
	};

	const onDelete = (id) => {
		return; // exercise 3.9: disable changes to contacts
		const personToDelete = persons.find((person) => person.id === id).name;
		if (confirm(`delete ${personToDelete} ?`)) {
			contactServices
				.remove(id)
				.then((deletedPerson) => {
					const newPersons = persons.filter(
						(person) => person.id !== deletedPerson.id
					);
					setPersons(newPersons);
					notify(`deleted "${deletedPerson.name}"`, "yellow", 4000);
				})
				.catch(() =>
					notify(`failed to delete "${personToDelete}"`, "red", 5000)
				);
		}
	};

	const notify = (message, color, duration) => {
		setNotification({ message, color });
		setTimeout(() => {
			setNotification({ message: null });
		}, duration);
	};

	return (
		<div>
			<h1>Phonebook</h1>
			<Notification notification={notification} />
			<Filter filterTerm={filterTerm} onFilterChange={onFilterChange} />
			<h2>Add a New Contact</h2>
			<Form
				addContact={addContact}
				newName={newName}
				newNumber={newNumber}
				onNameChange={onNameChange}
				onNumberChange={onNumberChange}
			/>
			<h2>Numbers</h2>
			<Persons persons={visiblePersons} onDelete={onDelete} />
		</div>
	);
};

export default App;
