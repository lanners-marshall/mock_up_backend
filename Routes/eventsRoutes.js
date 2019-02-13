const express = require('express');
const router = express.Router();
const knex = require("knex")
const dbConfig = require('../knexfile')
const db = require("../config.js")

//Create
//create a new event
//post http://localhost:5555/events
//-------------------------------------------
router.post('', (req, res) => {
	const {name, location, date, user_id } = req.body;

	/* first we check to see if the event already exists*/

	db('events')
	.where({name})
	.then(check => {
		//if it does not already exist we can create it
		if (check.length === 0){
			db.insert({name, location, date }).into('events')
			.then(() => {
				db('events')
				.where({name, location, date })
				.then(r1 => { //extra work around to get the id of the event to pass to the many to many join table
					id = r1[0].id
					let obj = {user_id, event_id: id}
					//now that event is created we sign up the user as someone going to the event
					db.insert(obj).into('users_events')
					.then(r2 => {
						return res.status(200).json(r2)
					})
				})
			})
			.catch(error => {
				console.log(error)
				return res.status(500).json(error)
			})//end of if statement
		} else {
			//if event already exists then we let the user know it is already there
			return res.status(200).json({msg: 'event is already present'})
		}
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