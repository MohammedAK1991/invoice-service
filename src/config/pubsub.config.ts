import { PubSub } from '@google-cloud/pubsub';
import * as dotenv from 'dotenv';

dotenv.config();

export const pubsubClient = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

export const TOPIC_NAME = 'projects/mediamarket-interview/topics/order-events';
export const SUBSCRIPTION_NAME =
  'projects/mediamarket-interview/subscriptions/invoice-service-subscription';
