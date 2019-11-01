const express = require('express');
const router = express.Router();
const db = require('./data/helpers/projectModel');

// ***ROUTE HANDLERS
// get all projects
router.get('/', (req, res) => {
    db.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

// get project by id
router.get('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.get(id)
    .then(project => {
        res.status(200).json( project );
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

// get project actions by id
router.get('/:id/actions', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.getProjectActions(id)
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

// add a new project
router.post('/', validateProject, (req, res) => {
    const project = req.body;
    db.insert(project)
    .then(response => {
        res.status(201).json( response );
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

// delete a project
router.delete('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(count => {
        res.status(200).json(count);
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

// update a project
router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const id = req.params.id;
    const update = req.body;
    db.update(id, update)
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ message: "server error", error: err }));
})

// ***CUSTOM MIDDLEWARE
// check project with id exists
function validateProjectId(req, res, next) {
    const id = req.params.id;
    db.get(id)
    .then(project => {
        if (!project) {
            res.status(404).json({ message: "project with given id not found" });
        }
        next();
    })
    .catch(err => {
        res.status(500).json({ message: 'server project get failed', error: err });
    })
}

function validateProject(req, res, next) {
    const project = req.body;
    !project && res.status(400).json({ message: 'you need to provide a body' });
    !project.name && res.status(400).json({ message: 'you need to provide a name for the project' });
    !project.description && res.status(400).json({ message: 'you need to provide a description for the project' });
    next();
}

module.exports = router;