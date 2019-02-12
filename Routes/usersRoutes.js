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
//get a user and all that users events
//get http://localhost:5555/users/:id
// to-do


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