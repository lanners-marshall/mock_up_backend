const express = require('express');
const router = express.Router();
const knex = require('knex')
const dbConfig = require('../knexfile')
const db = knex(dbConfig.development)

//Create
//create a new event
//post http://localhost:5555/events
//-------------------------------------------
router.post('', (req, res) => {
	const {name, location, date, user_id } = req.body;
	db.insert({name, location, date }).into('events')
	.then(response => {
		
		//if a user makes an event then that user is going to it
		//response[0] is the id of the new event

		let obj = {user_id, event_id: response[0]}
		db.insert(obj).into('users_events')
		.then(response => {
			return res.status(201).json(response)
		})
		.catch(error => {
			return res.status(500).json(error)
		})
	})
	.catch(error => {
		console.log(error)
		return res.status(500).json(error)
	})
})

//READ
//get all events
//get http://localhost:5555/events
//-------------------------------------------
router.get('', (req, res) => {
	db('events')
	.then(response => {
		return res.status(200).json(response)
	})
	.catch(error => {
		return res.status(500).json(error)
	})
})

//READ
//get all the users for an event
//get http://localhost:5555/events/:id
//example response
// [
//     {
//         "id": 1,
//         "name": "marshall lanners",
//         "location": "1440 4th street washington dc",
//         "date": "2/20/2019",
//         "user_id": 1,
//         "event_id": 2,
//         "email": "lanners.marshall@gmail.com"
//     },
//     {
//         "id": 2,
//         "name": "eric lanners",
//         "location": "1440 4th street washington dc",
//         "date": "2/20/2019",
//         "user_id": 2,
//         "event_id": 2,
//         "email": "lanners.eric@gmail.com"
//     }
// ]

router.get('/:id', (req, res) => {
	const { id } = req.params
	db('events')
	.join('users_events', 'users_events.user_id', '=', 'users.id')
	.join('users', 'events.id', '=', 'users_events.event_id')
	.where('events.id', id)
	.then(response => {
		res.status(200).json(response)
	})
	.catch(error => {
		res.status(500).json(error)
	})
})

//UPDATE
//update an event
//put http://localhost:5555/events/:id
//-------------------------------------------
router.put('/:id', (req, res) => {
	const { id } = req.params
	const {name, location, date } = req.body;
	db('events')
	.where({id})
	.update({name,location,date})
	.then(response => {
		return res.status(200).json(response)
	})
	.catch(error => {
		return res.status(500).json(error)
	})
})

//DELETE
//delete an event
//delete http://localhost:5555/events/:id
//-------------------------------------------
router.delete('/:id', (req, res) => {
	const {id} = req.params
	db('events')
	.where({id})
	.del()
	.then(response => {
		return res.status(200).json(response)
	})
	.catch(error => {
		return res.status(500).json(error)
	})
})

module.exports = router;