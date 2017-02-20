process.env.NODE_ENV = 'test';

const Task = require('./task.model');
const testHelper = require('../../utils/test-helper/test-helper');
const then = new testHelper.Then();
const request = new testHelper.Request('tasks');

let validTask;

describe('Tasks', () => {
    beforeEach((done) => {
        validTask = {
            name: 'Test Task',
            user: '58a73fab07404f65cf1ba0f5'
        };

        Task.remove({}, (error) => {
           done();
        });
    });

    /*
     * Test item creation
     */

    describe('/POST tasks', () => {
        it('should POST a task ', (done) => {
            request
                .post('/', validTask)
                .end((error, response) => {
                    then
                        .response(response)
                        .shouldBeOk()
                        .shouldBeABusinessObject()
                        .end(done);
                });
        });

        /*
         * Test default values
         */

        it('should create an incomplete task', (done) => {
            request
                .post('/', validTask)
                .end((error, response) => {
                    then
                        .response(response)
                        .shouldBeOk()
                        .shouldHaveFieldWithValue('isComplete', false)
                        .end(done);
                });
        });

        it('should create an unarchived task', (done) => {
            request
                .post('/', validTask)
                .end((error, response) => {
                    then
                        .response(response)
                        .shouldBeOk()
                        .shouldHaveFieldWithValue('isArchived', false)
                        .end(done);
                });
        });

        it('should create a non-deleted task', (done) => {
            request
                .post('/', validTask)
                .end((error, response) => {
                    then
                        .response(response)
                        .shouldBeOk()
                        .shouldHaveFieldWithValue('isDeleted', false)
                        .end(done);
                });
        });

        it('should create a task with displayOrder 0', (done) => {
            request
                .post('/', validTask)
                .end((error, response) => {
                    then
                        .response(response)
                        .shouldBeOk()
                        .shouldHaveFieldWithValue('displayOrder', 0)
                        .end(done);
                });
        });

        it('should create a task that has never been completed', (done) => {
            request
                .post('/', validTask)
                .end((error, response) => {
                    then
                        .response(response)
                        .shouldBeOk()
                        .shouldHaveFieldWithValue('timesCompleted', 0)
                        .end(done);
                });
        });

        /*
         * Test presence of required fields
         */

        it('should not POST a task without name field', (done) => {
            const task = validTask;
            task.name = undefined;

            request
                .post('/', task)
                .end((error, response) => {
                    then
                        .response(response)
                        .shouldBeOk()
                        .shouldReturnFieldRequiredError('name')
                        .end(done);
                });
        });
    });

    /*
     * Test item retrieval
     */

    describe('/GET tasks', () => {
      it('should GET all the tasks', (done) => {
        request
            .get('/')
            .end((error, response) => {
                then
                    .response(response)
                    .shouldBeOk()
                    .shouldBeAnEmptyArray()
                    .end(done);
            });
        });
    });

    describe('/GET/:id tasks', () => {
        it('should GET a task by the given id', (done) => {
            new Task(validTask).save((error, task) => {
                request
                    .get('/' + task._id, task)
                    .end((error, response) => {
                        then
                            .response(response)
                            .shouldBeOk()
                            .shouldBeABusinessObject()
                            .shouldHaveIdOf(task._id)
                            .end(done);
                    });
            });
        });
    });
});
