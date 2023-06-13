const { ObjectId } = require('mongodb');

const requestsController = (app, requestsCollection) => {
    app.get('/requests', async (req, res) => {
        const query = {}
        const cursor = requestsCollection.find(query)
        const requests = await cursor.toArray()
        res.json(requests)
    });

    app.get('/requests/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const request = await requestsCollection.findOne(query);

        if (!request) {
            res.status(404).send('request not found.');
            return;
        }

        res.send(request);
    });

    app.get('/requests/teacher/:teacherEmail', async (req, res) => {
        const teacherEmail = req.params.teacherEmail;
        const query = { techerEmail: teacherEmail };
        const sort = { timestamp: -1 }; // Sort by the latest timestamp in descending order
        const cursor = requestsCollection.find(query).sort(sort);
        const requests = await cursor.toArray();
        res.json(requests);
    });

    app.post('/requests', async (req, res) => {
        const newrequest = req.body;
        const result = await requestsCollection.insertOne(newrequest);
        res.send(result);
    });

    app.put('/requests/:id', async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updatedoc = {
          $set: { status }
        };
        const result = await requestsCollection.updateOne(filter, updatedoc);
        res.send(result);
      });

    app.delete('/requests/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await requestsCollection.deleteOne(query);
        res.send(result);
    });
};

module.exports = requestsController;
