const express = require('express');
const router = express.Router();
const knex = require('knex')

const dbConfig = require('../knexfile')
const db = knex(dbConfig.development)

//Create
//create a new favorite
//post http://localhost:5555/favorites
//-------------------------------------------
router.post('', (req, res) => {
	const {name, location, user_id} = req.body
	//check to see if it already is a favorite
	db('favorites')
	.where({name})
	.then(response => {
		//if already a favorite don't post to table
		if (response.length > 0){
			return res.status(200).json({msg: 'you already have place listed as favorite'})
		} else {
			//not yet a favorite then post to table
			db.insert({name, location, user_id}).into('favorites')
			.then(response => {
				return res.status(201).json(response)
			})
			.catch(error => {

				return res.status(500).json(error)
			})
		}
	})
	.catch(error => {
		console.log(error)
		return res.status(500).json(error)
	})
})

//READ
//get all favorites from a user
//get http://localhost:5555/favorites/:id
//-------------------------------------------
router.get('/:id', (req, res) => {
	const {id} = req.params
	db('users')
	.join('favorites', 'favorites.user_id', '=', 'users.id')
	.where('users.id', id)
	.then(response => {
		return res.status(200).json(response)
	})
	.catch(error => {
		console.log(error)
		return res.status(500).json(error)
	})
})

//DELETE
//delete a forvorite from a user
//delete http://localhost:5555/favorites/:id
//-------------------------------------------
router.delete('/:id', (req, res) => {
	const {id} = req.params
	db('favorites')
	.where({id})
	.del()
	.then(response => {
		return res.status(200).json(response)
	})
	.catch(error => {
		console.log(error)
		return res.status(500).json(response)
	})
})

module.exports = router;