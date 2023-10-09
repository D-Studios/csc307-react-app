import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
	users_list: [
		{
			id: 'xyz789',
			name: 'Charlie',
			job: 'Janitor',
		},
		{
			id: 'abc123',
			name: 'Mac',
			job: 'Bouncer',
		},
		{
			id : 'ppp222',
			name: 'Mac',
			job: 'Professor',
		},
		{
			id: 'yat999',
			name: 'Dee',
			job: 'Aspiring actress',
		},
		{
			id: 'zap555',
			name: 'Dennis',
			job: 'Bartender',
		}
	]
}


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World');
});

const findUserByName = (name) => {
	return users['users_list'].filter( (user)=> user['name'] === name);
}

const findUserByNameAndJob = (name, job) => {
	return users['users_list'].filter( (user)=> (user['name'] === name && user['job'] === job));
}

const findUserByJob= (job) => {
	return users['users_list'].filter( (user)=> user['job'] === job);
}
const findUserById = (id) =>
	users['users_list'].find( (user) => user['id'] === id);

const addUser = (user) => {
	users['users_list'].push(user);
	generateId(user);
	return user;
}

const deleteUserById = (id) => {
	users['users_list'] = users['users_list'].filter( (user) => user['id'] != id);
}

const generateId = (user) => {
	user['id'] = Math.random();
}
app.post('/users', (req, res) => {
	const userToAdd = req.body;
	let result = addUser(userToAdd);
	if(result == undefined){
		res.status(404).send("Resouce not found.");
	}
	else{
		res.status(201).send("Created");
		res.send(result);
	}
})

app.delete('/users/:id', (req, res) => {
	const id = req.params['id'];
	const length = users['users_list'].length;
	deleteUserById(id);
	if(users['users_list'].length == length)
		res.status(404).send('Resource not found.');
	else
		res.status(204).send('No Content');
})

app.get('/users/:id', (req, res) => {
	const id = req.params['id'];
	let result = findUserById(id);
	if (result === undefined){
		res.status(404).send('Resource not found.');
	}
	else{
		res.send(result);
	}
})

app.get('/users', (req, res)=> {
	const name = req.query.name;
	const job  = req.query.job;
	if(name!=undefined && job!=undefined){
		let result = findUserByNameAndJob(name, job);
		result = {users_list: result};
		res.send(result);
	}
	else if(name != undefined){
		let result = findUserByName(name);
		result = {users_list: result};
		res.send(result);
	}
	else if (job != undefined){
		let result = findUserByJob(job);
		result = {users_list: result};
		res.send(result);
	}
	else{
		res.send(users);
	}
});


app.listen(port, ()=>{
	console.log('Example app listening at http://localhost:${port}');
});
