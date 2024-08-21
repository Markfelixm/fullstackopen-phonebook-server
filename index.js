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

app.get("/api/persons/:id", (request, response, next) => {
	Contact.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => {
			next(error);
		});
});

app.post("/api/persons", (request, response, next) => {
	const person = new Contact({
		name: request.body.name,
		number: request.body.number,
	});
	person
		.save()
		.then((savedContact) => response.json(savedContact))
		.catch((error) => {
			next(error);
		});
});

app.delete("/api/persons/:id", (request, response, next) => {
	Contact.findByIdAndDelete(request.params.id)
		.then((deletedContact) => {
			if (deletedContact) {
				response.status(200).json(deletedContact);
			} else {
				response.status(204).end();
			}
		})
		.catch((error) => {
			next(error);
		});
});

app.put("/api/persons/:id", (request, response, next) => {
	const person = {
		name: request.body.name,
		number: request.body.number,
	};

	Contact.findByIdAndUpdate(request.params.id, person, {
		new: true,
		runValidators: true,
		context: "query",
	})
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error("server error:", error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		console.log("validation error triggered");
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

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
