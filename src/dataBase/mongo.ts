import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/admin';

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

export default db;