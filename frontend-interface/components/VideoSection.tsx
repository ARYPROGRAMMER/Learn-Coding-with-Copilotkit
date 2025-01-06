import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

const VideoSection = () => {
  const [isPlaying1, setIsPlaying1] = React.useState(false);
  const [isPlaying2, setIsPlaying2] = React.useState(false);

  const videos = [
    {
      id: 1,
      videoUrl: "https://vimeo.com/1044157863",
      thumbnail: "/thumbnail.png",
      title: "See A Full Fledged Demonstration",
      subtitle: "Watch the demo insight during development",
      isPlaying: isPlaying1,
      setIsPlaying: setIsPlaying1
    },
    {
      id: 2,
      videoUrl: "https://vimeo.com/1044282090", 
      thumbnail: "/thumbnail.png", 
      title: "Recent Deployed Demonstration",
      subtitle: "See Near Release Demonstration of the Project",
      isPlaying: isPlaying2,
      setIsPlaying: setIsPlaying2
    }
  ];

  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  };

  return (
    <motion.div 
      className="w-full max-w-[95vw] mx-auto mb-32 px-2 space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-800/90 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: video.id * 0.2 }}
        >
          <div className="aspect-video w-full h-full relative">
            {video.isPlaying ? (
              <iframe
                className="w-full h-full"
                src={getVimeoEmbedUrl(video.videoUrl)}
                title="Vimeo video player"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <Image 
                  src={video.thumbnail} 
                  width={2560} 
                  height={1440} 
                  alt="Video thumbnail" 
                  className="object-cover h-full w-full"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div
                        className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg hover:shadow-purple-500/50"
                        onClick={() => video.setIsPlaying(true)}
                      >
                        <Play className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-2xl text-white font-bold tracking-tight">{video.title}</p>
                        <p className="text-xl text-purple-200 mt-1">{video.subtitle}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-black hover:text-white border-white/20 hover:bg-white/10 transition-colors text-lg px-8"
                      onClick={() => video.setIsPlaying(!video.isPlaying)}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default VideoSection;