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
	const {name, location, date } = req.body;
	db.insert({name, location, date }).into('events')
	.then(response => {
		console.log(response)
		return res.status(201).json(response);
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
//get an event and all the users for that event
//get http://localhost:5555/events/:id
// to-do

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
