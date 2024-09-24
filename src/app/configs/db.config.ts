import { MongooseModuleOptions } from '@nestjs/mongoose';

const { DB_HOST, DB_PORT, DB_NAME } = process.env;

const dbConfig: MongooseModuleOptions = {
  uri: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
};

export default dbConfig;