const express = require('express');
const router = express.Router();
const db = require('../config.js')

//CREATE
//user signs up to go to an event
//post http://localhost:5555/users_events
//-------------------------------------------
router.post('', (req, res) => {

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


//DELETE
//delete user no longer going to event
//delete http://localhost:5555/users_events
//-------------------------------------------
router.delete('', (req, res) => {
	const {user_id, event_id} = req.body
	db('users_events')
	.where({user_id, event_id})
	.del()
	.then(response => {
		console.log(response)
		return res.status(200).json(response)
	})
	.catch(error => {
		return res.status(200).json(error)
	})
})

module.exports = router;