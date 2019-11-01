const express = require('express');
const router = express.Router();
const projectDB = require('./data/helpers/projectModel');

router.get('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    projectDB.get(id)
    .then(project => res.status(200).json(project))
})


function validateProjectId(res, req, next) {
    const id = req.params.id;
    projectDB.get(id)
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

module.exports = router;