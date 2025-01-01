import { PythonShell } from 'python-shell';
import path from 'path';

export async function analyzeDSAProblem(question: string, testCases?: any[]) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(process.cwd(), 'python');
    
    let options = {
      mode: 'text' as const,
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: pythonPath,
      args: [JSON.stringify({ question, testCases })]
    };

    PythonShell.run('langgraph_agent.py', options).then((messages: string | any[]) => {
      resolve(JSON.parse(messages[messages.length - 1]));
    }).catch(reject);
  });
}