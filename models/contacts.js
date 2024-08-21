const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
	.connect(uri)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "a name is required"],
		minLength: 3,
		maxLength: 40,
	},
	number: {
		type: String,
		required: [true, "a number is required"],
		minLength: 8,
		maxLength: 30,
		validate: {
			validator: (v) => {
				return /^\d{2,3}-\d+$/.test(v);
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const disconnect = () => {
	mongoose.connection.close().then(() => {
		console.log("disconnected from MongoDB");
		process.exit();
	});
};

const Contact = mongoose.model("Person", personSchema);

module.exports = { Contact, disconnect };
