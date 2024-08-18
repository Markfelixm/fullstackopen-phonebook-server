const mongoose = require("mongoose");

if (process.argv.length < 3 || process.argv.length > 5) {
	console.log(
		"usage: \n\
	add contact: node mongo.js <database password> <contact name> <contact number> \n\
	list contacts: node mongo.js <database password>"
	);
	process.exit(1);
}

const password = process.argv[2];
const uri = `mongodb+srv://marmulle:${password}@playground.gw9xq.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=playground`;

mongoose.set("strictQuery", false);
mongoose.connect(uri);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
	console.log("phonebook:");
	Person.find({}).then((persons) => {
		persons.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
} else {
	const newPerson = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});
	newPerson.save().then((res) => {
		console.log(`added ${res.name} ${res.number} to phonebook`);
		mongoose.connection.close();
	});
}
