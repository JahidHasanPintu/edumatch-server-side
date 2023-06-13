const { ObjectId } = require('mongodb');

const proposalController = (app, proposalCollection) => {
  app.get('/proposals', async (req, res) => {
    const { subject } = req.query;
    const query = {};

    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    const cursor = proposalCollection.find(query);
    const proposals = await cursor.toArray();
    res.json(proposals);
  });


  app.get('/proposals/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const proposal = await proposalCollection.findOne(query);

    if (!proposal) {
      res.status(404).send('Proposal not found.');
      return;
    }

    res.send(proposal);
  });

  app.post('/proposals', async (req, res) => {
    const { teacherName, charge, platform, subject, experience, title, description } = req.body;
    const newProposal = req.body;
    const result = await proposalCollection.insertOne(newProposal);
    res.send(result);
  });

  app.put('/proposals/:id', async (req, res) => {
    const id = req.params.id;
    const updateProposal = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedoc = {
      $set: {
        teacherName: updateProposal.teacherName
      }
    };
    const result = await proposalCollection.updateOne(filter, updatedoc, options);
    res.send(result);
  });

  app.delete('/proposals/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await proposalCollection.deleteOne(query);
    res.send(result);
  });
};

module.exports = proposalController;
