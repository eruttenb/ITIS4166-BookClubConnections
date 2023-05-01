const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost} = require('../middlewares/auth');
const {validateID, validateResult, validateConnection, validateRsvp} = require('../middlewares/validator');

const router = express.Router();

//GET /connections: send all connections to the user
router.get('/', controller.index);

//GET /connections/new: send html form for creating a new connection
router.get('/new', isLoggedIn, controller.new);

//POST /connections: created a new connection
router.post('/', isLoggedIn, validateConnection, validateResult, controller.create);

//GET /connections/:id: get details of connection identified by id
router.get('/:id', validateID, controller.show);

//GET /connections/:id/edit: send html form for editing an existing connection
router.get('/:id/edit', validateID, isLoggedIn, isHost, controller.edit);

//PUT /connections/:id: update the connection by id
router.put('/:id', validateID, isLoggedIn, isHost, validateConnection, validateResult, controller.update);

//DELETE /connections/:id: delete the story identified by id
router.delete('/:id', validateID, isLoggedIn, isHost, controller.delete);

//POST /connections/connection_id/rsvp: handle rsvp request
router.post('/:id/rsvp', validateID, isLoggedIn, validateRsvp, validateResult, controller.rsvp);

module.exports = router;