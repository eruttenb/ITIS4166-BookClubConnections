const {validationResult} = require('express-validator');
const { connections } = require('mongoose');
const model = require('../models/connection');
const Rsvp = require('../models/rsvp');

exports.index = (req, res, next)=>{
    model.find()
    .then(connections=>{
        let topics = [];
        connections.forEach(connection => topics.push(connection.topic));
        topics = topics.filter((value, index, self) => self.indexOf(value) === index);
        res.render('./connection/index', {connections, topics})
    })
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./connection/new');
};

exports.create = (req, res, next)=>{
    let connection = new model(req.body); //create a new connection document
    //user creating connection is current user
    connection.host = req.session.user;
    connection.save() //insert the document to database
    .then(connection=> {
        req.flash('success', 'Successfully created connection!');
        res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next)=>{
    let id = req.params.id;

    model.findById(id).populate('host', 'firstName lastName')
    .then(connection=>{
        if(connection) {
            //count 'yes' rsvps for the connection
            Rsvp.countDocuments({ connection: id, response: 'YES' })
            .then(count=> {
                res.render('./connection/show', {connection, count});
            })
            .catch(err=>next(err));
        } else {
            let err = new Error("Cannot find a connection with id " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;

    model.findById(id)
    .then(connection=>{
        return res.render('./connection/edit', {connection});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        req.flash('success', 'Successfully updated connection!');
        res.redirect('/connections/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindandModify: false})
    .then(connection=>{
        //delete the associated rsvps
        Rsvp.deleteMany({connection: id})
        .then(success=>{
            req.flash('success', 'Successfully deleted connection!');
            res.redirect('/connections');
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};

exports.rsvp = (req, res, next)=>{
    let user = req.session.user;
    let id = req.params.id;
    let response = req.body.rsvpbutton;

    //check if rsvp exists
    Rsvp.findOne({ user: user, connection: id })
    .then(rsvp=>{
        if(!rsvp) {
            //create new rsvp model with user, connection, and response
            let newRsvp = new Rsvp(req.body);
            newRsvp.user = user;
            newRsvp.connection = id;
            newRsvp.response = response;
            newRsvp.save() //insert the document to database
            req.flash('success', 'Successfully created an RSVP for this connection!');
            res.redirect('/users/profile');
        } else {
            //if rsvp exists, update document in database
            Rsvp.findOneAndUpdate({ user: user, connection: id }, { response: response })
            .then(update=>{
                req.flash('success', 'Successfully updated the RSVP for this connection!');
                res.redirect('/users/profile');
            })
            .catch(err=>next(err));     
        }
    })
    .catch(err=>next(err));
};