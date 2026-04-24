export interface Agent<Input, Output> {
  name: string;
  execute(input: Input): Promise<Output>;
}
