const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtsById,
    createThought,
    updateThought,
    deleteThought,
    addResponse,
    removeResponse,
} = require('../../controllers/thoughts-controller');

router.route('/').get(getAllThoughts).post(createThought);

router  
    .route('/:id')
    .get(getThoughtsById)
    .put(updateThought)
    .delete(deleteThought)

router.route('/"thoughtId/response').post(addResponse);

router.route('/:thoughtId/response/:responseId').delete(removeResponse);

module.exports = router;