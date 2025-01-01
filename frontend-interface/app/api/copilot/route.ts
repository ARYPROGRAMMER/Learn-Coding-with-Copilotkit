// import { NextRequest } from "next/server";
// import {
//   CopilotRuntime,
//   GroqAdapter,
//   copilotRuntimeNextJSAppRouterEndpoint,
// } from "@copilotkit/runtime";

// const serviceAdapter = new GroqAdapter({ model: "llama-3.3-70b-versatile" });

// const runtime = new CopilotRuntime({
//   remoteEndpoints: [
//     {
//       url: process.env.REMOTE_ACTION_URL || "http://localhost:8000/copilotkit",
//     },
//   ],
// });

// export const POST = async (req: NextRequest) => {
//   const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
//     runtime,
//     serviceAdapter,
//     endpoint: "/api/copilotkit",
//   });

//   return handleRequest(req);
// };

import { NextResponse } from 'next/server';

import { analyzeDSAProblem } from '@/lib/python-bridge';
import { createGroqClient } from '@/lib/groq';

const groq = createGroqClient();

export async function POST(req: Request) {
  try {
    const { question, testCases } = await req.json();
    
    interface DSASolution {
      explanation: string;
      [key: string]: any;
    }

    // Call Python agent through API
    const solution = await analyzeDSAProblem(question, testCases) as DSASolution;
    
    // Get additional insights from Groq
    const additionalInsights = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a DSA expert. Provide additional insights for the solution."
        },
        {
          role: "user",
          content: `Problem: ${question}\nSolution: ${solution.explanation}`
        }
      ],
      model: "mixtral-8x7b-32768",
    });

    return NextResponse.json({
      ...solution,
      additionalInsights: additionalInsights.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}