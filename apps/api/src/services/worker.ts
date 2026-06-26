import { Worker, Queue } from 'bullmq';
import { prisma } from '../db';
import { rrulestr } from 'rrule';
import { socketService } from './socket.service';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const recurringTasksQueue = new Queue('recurring-tasks', { connection });

export const startWorker = () => {
  const worker = new Worker('recurring-tasks', async job => {
    // This job can be scheduled to run every midnight to check if there are any missed recurring tasks
    console.log(`Processing job: ${job.name}`);
    if (job.name === 'check-missed-recurring') {
      // In a more complex setup, this would query tasks where next instance should have been spawned
      // but wasn't (e.g. if the user didn't complete the task in time, do we spawn another?)
      // For now, our primary mechanism is "spawn on completion" in task.controller.ts
    }
  }, { connection });

  worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });

  console.log('BullMQ worker started');
};
