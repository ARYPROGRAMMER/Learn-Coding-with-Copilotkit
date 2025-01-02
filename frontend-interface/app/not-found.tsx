import React from 'react';
import Link from 'next/link';
import { Terminal, Code2, ArrowLeft, Server } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Floating Code Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float text-purple-300/20 text-xl
              ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-fast'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {'{'}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main Content */}
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated Terminal Icon */}
          <div className="mb-8 relative">
            <Terminal 
              className="w-16 h-16 mx-auto animate-pulse text-purple-400"
              strokeWidth={1.5}
            />
            <Code2 
              className="w-8 h-8 absolute top-12 left-1/2 -translate-x-1/2 text-green-400 animate-bounce"
              strokeWidth={1.5}
            />
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold mb-4 animate-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-6 text-purple-200">
            Under Maintenance
          </h2>

          <div className="mb-8 space-y-4 text-purple-100/80">
            <p className="text-lg">
              We&apos;re currently optimizing this section for Quira to bring you an even better coding experience.
            </p>
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Server className="w-5 h-5 animate-pulse" />
              <span className="text-sm">System Upgrade in Progress</span>
            </div>
          </div>

     
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-6 py-3 text-lg bg-purple-600 hover:bg-purple-500 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Dashboard</span>
          </Link>

          {/* Status Indicator */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span className="text-sm text-purple-200">Systems Operating Normally</span>
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
};

export default NotFound;