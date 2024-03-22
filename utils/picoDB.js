const PicoDB = require('picodb');
const db = PicoDB();

const initilize = async (data) => {
    const [doc] = await db.insertOne(data);
    return doc;
};

const findData = async (sessionID) => {
    const doc = await db.find({ sessionId: sessionID }).toArray();
    return doc;
};

const updateData = async (sessionID, data) => {
    const [doc] = await db.updateOne({ _id: sessionID, ...data });
    return doc;
};

const deleteData = async (sessionID) => {
    const data = await db.deleteOne({ _id: sessionID });
};

module.exports = { initilize, findData, updateData, deleteData };