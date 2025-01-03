import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";


const serviceAdapter = new GroqAdapter({ model: "llama-3.3-70b-versatile" });

const runtime = new CopilotRuntime(
  {
  remoteEndpoints: [
    {
      url: process.env.REMOTE_ACTION_URL || "http://localhost:8000/copilotkit" || "https://learn-coding-with-copilotkit.onrender.com/copilotkit",
    },
  ],
}

);

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  
  });
  return handleRequest(req);
};

