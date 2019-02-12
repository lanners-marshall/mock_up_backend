const express = require('express');
const router = express.Router();
const knex = require('knex')

const dbConfig = require('../knexfile')
const db = knex(dbConfig.development)

//Create
//create a new user
//post http://localhost:5555/users
//-------------------------------------------
router.post('', (req, res) => {
	const {name, email } = req.body;

	db('users')
	.where({email})
	.then(response => {

		/*only add a user to database if one does not exist already upon login
		either way we get the users info back*/

		if (response.length === 0){
			db.insert({name, email}).into('users')
			.then(users => {
				return res.status(201).json(users)
			})
		} else {
			return  res.status(200).json(response)
		}
	})
	.catch(error => {
		console.log(error)
		return res.status(500).json(error)
	})
})

//CREATE
//user signs up to go to an event
//post http://localhost:5555/users/events
router.post('/events', (req, res) => {

	//would have to pass this is fron the front end
	const {user_id, event_id} = req.body

	//check is user is already going to event
	db('users_events')
	.where({user_id, event_id})
	.then(response => {

		// if user attemps to sign up for event he is already going to
		if (response.length > 0){
			return res.status(200).json({msg: 'you are aleady going to this event'})
		} else {
		
			//user adds event since he is not yet going to event
			db.insert({user_id, event_id}).into('users_events')
			.then(response => {
				return res.status(200).json(response)
			})
			//catch error for adding event
			.catch(error => {
				return res.status(500).json(error)
			})
		}
	})
	//catch error for looking up if user is going to event
	.catch(error => {
		return res.status(500).json(error)
	})
})

//READ
//get all users
//get http://localhost:5555/users
//-------------------------------------------
router.get('', (req, res) => {
	db('users')
	.then(response => {
		return res.status(200).json(response)
	})
	.catch(error => {
		return res.status(500).json(error)
	})
})


//READ
//get all events for a user
//get http://localhost:5555/users/:id
//example response
// [
//     {
//         "id": 1,
//         "name": "taco tuesday run 2",
//         "email": "lanners.marshall@gmail.com",
//         "user_id": 1,
//         "event_id": 1,
//         "location": "770 mercer street seattle wa",
//         "date": "2/14/2019"
//     },
//     {
//         "id": 2,
//         "name": "wensday taco run",
//         "email": "lanners.marshall@gmail.com",
//         "user_id": 1,
//         "event_id": 2,
//         "location": "1440 4th street washington dc",
//         "date": "2/20/2019"
//     }
// ]

router.get('/:id', (req, res) => {
	const { id } = req.params
	db('users')
	.join('users_events', 'users_events.user_id', '=', 'users.id')
	.join('events', 'events.id', '=', 'users_events.event_id')
	.where('users.id', id)
	.then(response => {
		res.status(200).json(response)
	})
	.catch(error => {
		res.status(500).json(error)
	})
})

//UPDATE
//update a user
//put http://localhost:5555/users/:id
//-------------------------------------------
router.put('/:id', (req , res) => {
	const { id } = req.params
	console.log(id)
	const {name, email } = req.body;
	console.log(req.body)
	db('users')
	.where({id})
	.update({name, email})
	.then(response => {
		return res.status(200).json(response)
	})
	.catch(error => {
		return res.status(500).json(error)
	})
})

//DELETE
//delete a user
//delete http://localhost:5555/users
//-------------------------------------------
router.delete('/:id', (req, res) => {
	const {id} = req.params
	db('users')
	.where({id})
	.del()
	.then(response => {
		console.log(response)
		return res.status(200).json(response)
	})
	.catch(error => {
		return res.status(500).json(error)
	})
})

module.exports = router;