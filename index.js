require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const { Contact, disconnect } = require("./models/contacts");

const app = express();

morgan.token("data", function (req, res) {
	return req.method == "POST" ? JSON.stringify(req.body) : " ";
});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

const getInfo = (persons) => {
	return `
		<div>
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${Date()}</p>
		</div>
		`;
};

app.get("/api/info", (request, response) => {
	Contact.find({}).then((persons) => {
		response.send(getInfo(persons));
	});
});

app.get("/api/persons", (request, response) => {
	Contact.find({}).then((persons) => {
		response.json(persons);
	});
});

// app.get("/api/persons/:id", (request, response) => {
// 	const person = persons.find((person) => person.id === request.params.id);

// 	if (person) {
// 		response.json(person);
// 	} else {
// 		response.status(404).end();
// 	}
// });

// const isNameTaken = (name) => {
// 	return persons.map((person) => person.name).includes(name);
// };

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
	// if (isNameTaken(request.body.name)) {
	// 	return response.status(400).json({
	// 		error: "name must be unique",
	// 	});
	// }
	const person = new Contact({
		name: request.body.name,
		number: request.body.number,
	});
	person.save().then((savedContact) => response.json(savedContact));
});

// app.delete("/api/persons/:id", (request, response) => {
// 	const id = request.params.id;
// 	persons = persons.filter((person) => person.id !== request.params.id);

// 	response.status(204).end();
// });

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

const shutdown = () => {
	console.log("shutting down server");
	server.close();
	disconnect();
};

process.on("SIGINT", shutdown).on("SIGTERM", shutdown);
