const express = require('express');
const router = express.Router();
const db = require('./data/helpers/actionModel');
const projectDB = require('./data/helpers/projectModel');

// ***ROUTE HANDLERS
// get all actions
router.get('/', (req, res) => {
    db.get()
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => res.status(500).json({ message: "server failed", error: err }));
})

// get action by id
router.get('/:id', validateActionId, (req, res) => {
    const id = req.params.id;
    db.get(id)
    .then(action => {
        res.status(200).json(action);
    })
    .catch(err => res.status(500).json({ message: "server failed", error: err }));
})

// create a new action
router.post('/', validateAction, (req, res) => {
    const action = req.body;
    db.insert(action)
    .then(action => {
        res.status(201).json(action);
    })
    .catch(err => res.status(500).json({ message: "server failed", error: err }));
})

// delete an action
router.delete('/:id', validateActionId, (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(count => {
        res.status(200).json(count)
    })
    .catch(err => res.status(500).json({ message: "server failed", error: err }));
})

// update an action
router.put('/:id', validateActionId, validateAction, (req, res) => {
    const id = req.params.id;
    const update = req.body;
    db.update(id, update)
    .then(updatedAction => {
        res.status(200).json(updatedAction)
    })
    .catch(err => res.status(500).json({ message: "server failed", error: err }));
})


// ***CUSTOM MIDDLEWARE
// check action with id exists
function validateActionId(req, res, next) {
    const id = req.params.id;
    db.get(id)
    .then(action => {
        if (!action) {
            res.status(404).json({ message: "action with given id not found" });
        }
        next();
    })
    .catch(err => {
        res.status(500).json({ message: 'server action get failed', error: err });
    })
}

// check that new action has valid object shape
function validateAction (req, res, next) {
    const action = req.body;
    !action && res.status(400).json({ message: 'you need to provide a body' });
    !action.project_id && res.status(400).json({ message: 'you need to provide the project_id which you want to add this action to' });
    !action.description && res.status(400).json({ message: 'you need to provide a description for this action' });
    (action.description.length > 128) && res.status(400).json({ message: 'description cannot be more than 128 characters' });
    !action.notes && res.status(400).json({ message: 'you need to provide notes for this action' });

    projectDB.get(action.project_id)
    .then(project => {
        !project && res.status(404).json({ message: "project with given project_id not found" });
        next();
    })
}

module.exports = router;