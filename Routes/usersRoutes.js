const express = require('express');
const router = express.Router();
const knex = require('knex')
const db = require('../config.js')

//Create
//create a new user
//post http://localhost:5555/users
//-------------------------------------------
router.post("", (req, res) => {
  const { name, email } = req.body;
  let id
  db("users")
    .insert({
      name: name,
      email: email
    })
    .then(ids => {
    	id = ids[0]
      res.status(201).json(id);
    })
    .catch(err => {

    	/*
	    	work around to get users id back if they are already in the the database
	    	because we have users email set to unique
    	*/

      db('users')
      .where({email})
      .then(response => {
      	res.status(200).json(response[0].id)
      })
    });
});

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
//delete http://localhost:5555/users/:id
//-------------------------------------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  // finds and deletes user
  db("users")
    .where({ id })
    .del()
    .then(response => {
      // deletes user's relationship in users_friends table
      db("users_friends")
        .where({ user_id: id })
        .del()
        .then(() => {
          // deletes user relationship where he is a friend in users_friends table
          db("users_friends")
            .where({ friends_id: id })
            .del()
            .then(count => {
              res.status(200).json(count);
            })
            .catch(error => {
              res.status(500).json(error);
            });
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;