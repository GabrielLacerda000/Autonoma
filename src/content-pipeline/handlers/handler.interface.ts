import { Job } from 'bullmq';
import { FlowProducer } from 'bullmq';

export interface HandlerDeps {
  flowProducer: FlowProducer;
}

export interface JobHandler {
  execute(job: Job, deps?: HandlerDeps): Promise<void>;
}
