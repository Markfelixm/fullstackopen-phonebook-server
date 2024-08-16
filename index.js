const express = require("express");
var morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

const getInfo = () => {
	return `
		<div>
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${Date()}</p>
		</div>
		`;
};

app.get("/api/info", (request, response) => {
	response.send(getInfo());
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const person = persons.find((person) => person.id === request.params.id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

const isNameTaken = (name) => {
	return persons.map((person) => person.name).includes(name);
};

app.post("/api/persons", (request, response) => {
	if (!request.body.name) {
		return response.status(400).json({
			error: "person name is missing",
		});
	}
	if (!request.body.number) {
		return response.status(400).json({
			error: "person number is missing",
		});
	}
	if (isNameTaken(request.body.name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}
	const id = Math.floor(Math.random() * 2 ** 20);
	const person = {
		name: request.body.name,
		number: request.body.number,
		id: id,
	};
	persons = persons.concat(person);
	response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== request.params.id);

	response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
