import mongoose from 'mongoose';
import config from 'config';

const initDB = async () => {
  await mongoose.connect(config.get('database.uri'));
};

export default initDB;
