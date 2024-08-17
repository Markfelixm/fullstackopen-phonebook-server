import axios from "axios";

const baseURL = "http://localhost:3001/api/persons";

const getAll = () =>
	axios
		.get(baseURL)
		.then((response) => response.data)
		.catch(() => console.log("server: could not get all"));

const create = (newContact) =>
	axios
		.post(baseURL, newContact)
		.then((response) => response.data)
		.catch(() =>
			console.log(`server: could not create contact "${newContact.name}"`)
		);

const remove = (id) =>
	axios
		.delete(`${baseURL}/${id}`)
		.then((response) => response.data)
		.catch(() => console.log(`server: could not delete id "${id}"`));

const update = (updatedContact) =>
	axios
		.put(`${baseURL}/${updatedContact.id}`, updatedContact)
		.then((response) => response.data)
		.catch(() =>
			console.log(`server: could not update contact "${updatedContact.name}"`)
		);

export default {
	getAll,
	create,
	remove,
	update,
};
