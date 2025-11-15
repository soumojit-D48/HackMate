

// import amqp, { Connection, Channel } from 'amqplib';
// // import { QUEUE_NAMES } from './constants.js';

// let connection: Connection | null = null;
// let channel: Channel | null = null;

// export const connectRabbitMQ = async (): Promise<void> => {
//   try {
//     connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
//     channel = await connection.createChannel();

//     console.log('✅ RabbitMQ connected');

//     connection.on('error', (err) => {
//       console.error('RabbitMQ error:', err);
//       setTimeout(connectRabbitMQ, 5000);
//     });

//     connection.on('close', () => {
//       console.log('RabbitMQ closed, reconnecting...');
//       setTimeout(connectRabbitMQ, 5000);
//     });

//     await initializeQueues();
//   } catch (error) {
//     console.error('Failed to connect to RabbitMQ:', error);
//     setTimeout(connectRabbitMQ, 5000);
//   }
// };

// const initializeQueues = async (): Promise<void> => {
//   if (!channel) throw new Error('Channel not initialized');

//   for (const queueName of Object.values(QUEUE_NAMES)) {
//     await channel.assertQueue(queueName, { durable: true });
//   }

//   await channel.assertExchange('dead_letter_exchange', 'direct', { durable: true });
//   await channel.assertQueue('dead_letter_queue', { durable: true });
//   await channel.bindQueue('dead_letter_queue', 'dead_letter_exchange', 'dead_letter');

//   console.log('✅ Queues initialized');
// };

// export const getChannel = (): Channel => {
//   if (!channel) throw new Error('RabbitMQ channel not initialized');
//   return channel;
// };

// export const publishToQueue = async (queue: string, message: any): Promise<void> => {
//   const ch = getChannel();
//   const messageBuffer = Buffer.from(JSON.stringify(message));
//   ch.sendToQueue(queue, messageBuffer, { persistent: true });
// };

// export const consumeFromQueue = async (
//   queue: string,
//   callback: (message: any) => Promise<void>
// ): Promise<void> => {
//   const ch = getChannel();
  
//   await ch.consume(queue, async (msg) => {
//     if (msg) {
//       try {
//         const content = JSON.parse(msg.content.toString());
//         await callback(content);
//         ch.ack(msg);
//       } catch (error) {
//         console.error('Error processing message:', error);
//         ch.nack(msg, false, true);
//       }
//     }
//   }, { noAck: false });
// };
















// import amqp, { Connection, Channel, Options, Replies } from 'amqplib';

// // Example QUEUE_NAMES, replace with your actual constants
// export const QUEUE_NAMES = {
//   TASK_QUEUE: 'task_queue',
//   EMAIL_QUEUE: 'email_queue'
// };

// let connection: Connection | null = null;
// let channel: Channel | null = null;

// /**
//  * Connect to RabbitMQ and initialize channel & queues
//  */
// export const connectRabbitMQ = async (): Promise<void> => {
//   try {
//     connection = (await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672')) as Connection;
//     channel = (await connection.createChannel()) as Channel;

//     console.log('✅ RabbitMQ connected');

//     // Handle connection errors and auto-reconnect
//     connection.on('error', (err) => {
//       console.error('RabbitMQ connection error:', err);
//       setTimeout(connectRabbitMQ, 5000);
//     });

//     connection.on('close', () => {
//       console.log('RabbitMQ connection closed, reconnecting...');
//       setTimeout(connectRabbitMQ, 5000);
//     });

//     await initializeQueues();
//   } catch (error) {
//     console.error('Failed to connect to RabbitMQ:', error);
//     setTimeout(connectRabbitMQ, 5000);
//   }
// };

// /**
//  * Initialize queues and dead-letter exchange
//  */
// const initializeQueues = async (): Promise<void> => {
//   if (!channel) throw new Error('RabbitMQ channel not initialized');

//   // Initialize your queues
//   for (const queueName of Object.values(QUEUE_NAMES)) {
//     await channel.assertQueue(queueName, { durable: true });
//   }

//   // Dead-letter setup
//   await channel.assertExchange('dead_letter_exchange', 'direct', { durable: true });
//   await channel.assertQueue('dead_letter_queue', { durable: true });
//   await channel.bindQueue('dead_letter_queue', 'dead_letter_exchange', 'dead_letter');

//   console.log('✅ Queues initialized');
// };

// /**
//  * Get the current channel (throws if not initialized)
//  */
// export const getChannel = (): Channel => {
//   if (!channel) throw new Error('RabbitMQ channel not initialized');
//   return channel;
// };

// /**
//  * Publish a message to a queue
//  */
// export const publishToQueue = async (queue: string, message: any): Promise<void> => {
//   const ch = getChannel();
//   const buffer = Buffer.from(JSON.stringify(message));
//   ch.sendToQueue(queue, buffer, { persistent: true });
// };

// /**
//  * Consume messages from a queue
//  */
// export const consumeFromQueue = async (
//   queue: string,
//   callback: (msg: any) => Promise<void>
// ): Promise<void> => {
//   const ch = getChannel();

//   await ch.consume(
//     queue,
//     async (msg) => {
//       if (msg) {
//         try {
//           const content = JSON.parse(msg.content.toString());
//           await callback(content);
//           ch.ack(msg);
//         } catch (error) {
//           console.error('Error processing message:', error);
//           ch.nack(msg, false, true);
//         }
//       }
//     },
//     { noAck: false }
//   );
// };





import amqp, { Connection, Channel } from 'amqplib';
import { QUEUE_NAMES } from './constants.js';

let connection: Connection | null = null;
let channel: Channel | null = null;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    channel = await connection.createChannel();

    console.log('✅ RabbitMQ connected');

    connection.on('error', (err) => {
      console.error('RabbitMQ error:', err);
      setTimeout(connectRabbitMQ, 5000);
    });

    connection.on('close', () => {
      console.log('RabbitMQ closed, reconnecting...');
      setTimeout(connectRabbitMQ, 5000);
    });

    await initializeQueues();
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    setTimeout(connectRabbitMQ, 5000);
  }
};

const initializeQueues = async (): Promise<void> => {
  if (!channel) throw new Error('Channel not initialized');

  for (const queueName of Object.values(QUEUE_NAMES)) {
    await channel.assertQueue(queueName, { durable: true });
  }

  await channel.assertExchange('dead_letter_exchange', 'direct', { durable: true });
  await channel.assertQueue('dead_letter_queue', { durable: true });
  await channel.bindQueue('dead_letter_queue', 'dead_letter_exchange', 'dead_letter');

  console.log('✅ Queues initialized');
};

export const getChannel = (): Channel => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
};

export const publishToQueue = async (queue: string, message: any): Promise<void> => {
  const ch = getChannel();
  const messageBuffer = Buffer.from(JSON.stringify(message));
  ch.sendToQueue(queue, messageBuffer, { persistent: true });
};

export const consumeFromQueue = async (
  queue: string,
  callback: (message: any) => Promise<void>
): Promise<void> => {
  const ch = getChannel();
  
  await ch.consume(queue, async (msg) => {
    if (msg) {
      try {
        const content = JSON.parse(msg.content.toString());
        await callback(content);
        ch.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        ch.nack(msg, false, true);
      }
    }
  }, { noAck: false });
};