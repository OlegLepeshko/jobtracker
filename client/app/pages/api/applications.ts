import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const applications = await db.collection('applications').find({}).toArray();
    res.status(200).json(applications);
  } else if (req.method === 'POST') {
    const application = req.body;
    const result = await db.collection('applications').insertOne(application);
    res.status(201).json(result.insertedId);
  } else if (req.method === 'PUT') {
    const { id, ...data } = req.body;
    const result = await db.collection('applications').updateOne({ _id: new ObjectId(id) }, { $set: data });
    res.status(200).json(result);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await db.collection('applications').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Application deleted' });
  }
};

export default handler;
