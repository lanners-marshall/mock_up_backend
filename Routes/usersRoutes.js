const express = require('express');
const router = express.Router();
const knex = require('knex')
const db = require('../config.js')

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
			.then(() => {

				/*each time we make a user that user could be a possible friend
				so we add them to friends table and fliter it later */

				db.insert({name, email}).into('friends')
				.then(() => {
					
					
					db('users')
					.where({name, email})
					.then(response => {
						let id = response[0].id
						return res.status(200).json([id])
					})
				})
				
			})
		} else {

			/*
				this way you do the check the same way no matter what
				for when a user signs in vs sign up on the front end
				to get the id
			*/
			
			let id = response[0].id
			return  res.status(200).json([id])
		}
	})
	.catch(error => {
		console.log(error)
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
	.then(() => {

		/*since the id of the user will always match that users version
		in the friends table we update both with same id*/

		db('friends')
		.where({id})
		.update({name, email})
		.then(response => {
			return res.status(200).json(response)
		})
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
	.then(() => {

		//delete a user and that user as being a possible friend

		db('friends')
		.where({id})
		.del()
		.then(response => {
			return res.status(200).json(response)
		})
	})
	.catch(error => {
		return res.status(500).json(error)
	})
})

module.exports = router;