import { AssemblyAI } from 'assemblyai';

export const assemblyAI = new AssemblyAI({
  apiKey: `${process.env.ASSEMBLY_AI_API}`, 
});
