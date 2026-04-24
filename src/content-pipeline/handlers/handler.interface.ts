import { Job } from 'bullmq';
import { FlowProducer } from 'bullmq';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export interface HandlerDeps {
  flowProducer: FlowProducer;
  db: NodePgDatabase;
}

export interface JobHandler {
  execute(job: Job, deps?: HandlerDeps): Promise<void>;
}
