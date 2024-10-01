import { Injectable, Logger } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PubSubService {
  private readonly logger = new Logger(PubSubService.name);
  private readonly pubSubClient: PubSub;

  constructor() {
    this.pubSubClient = new PubSub({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
  }

  async publishMessage(topicName: string, data: any): Promise<string> {
    const dataBuffer = Buffer.from(JSON.stringify(data));

    try {
      const messageId = await this.pubSubClient
        .topic(topicName)
        .publishMessage({ data: dataBuffer });
      this.logger.log(`Message ${messageId} published.`);
      return messageId;
    } catch (error) {
      this.logger.error(`Error publishing message: ${error.message}`);
      throw error;
    }
  }

  async subscribe(
    subscriptionName: string,
    messageHandler: (message: any) => void,
  ) {
    const subscription = this.pubSubClient.subscription(subscriptionName);

    subscription.on('message', (message) => {
      this.logger.log(`Received message ${message.id}:`);
      this.logger.log(`Data: ${message.data}`);
      messageHandler(message);
      message.ack();
    });

    subscription.on('error', (error) => {
      this.logger.error(`Subscription error: ${error.message}`);
    });
  }
}
