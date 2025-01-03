import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import mermaid from 'mermaid';
import { 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  RotateCw, 
  Maximize2,
  Copy,
  Move
} from 'lucide-react';

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

const MermaidRenderer = ({ value }: { value: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      themeVariables: {
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: '16px',
        primaryColor: '#2563eb',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#94a3b8',
        lineColor: '#64748b',
        secondaryColor: '#3b82f6',
        tertiaryColor: '#60a5fa'
      }
    });

    const renderDiagram = async () => {
      try {
        await mermaid.contentLoaded();
        setIsLoading(false);
        // Center after initial render
        requestAnimationFrame(centerContent);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [value]);

  const centerContent = () => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const content = contentRef.current.getBoundingClientRect();

    const translateX = (container.width - content.width) / 2;
    const translateY = (container.height - content.height) / 2;

    setTransform(prev => ({
      ...prev,
      translateX,
      translateY
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;

      setTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));

      lastPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleZoom = (delta: number) => {
    setTransform(prev => {
      const newScale = Math.max(0.25, Math.min(2, prev.scale + delta));
      return { ...prev, scale: newScale };
    });
  };

  const resetView = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
    requestAnimationFrame(centerContent);
  };

  const handleDownload = async () => {
    if (!containerRef.current) return;
    try {
      const svgElement = containerRef.current.querySelector('svg');
      if (!svgElement) return;
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width * transform.scale;
        canvas.height = img.height * transform.scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const a = document.createElement('a');
        a.download = 'diagram.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleCopy = async () => {
    if (!containerRef.current) return;
    try {
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        await navigator.clipboard.writeText(svgString);
      }
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!value) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.25)}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Slider
            value={[transform.scale * 100]}
            onValueChange={(value) => setTransform(prev => ({ ...prev, scale: value[0] / 100 }))}
            min={25}
            max={200}
            step={25}
            className="w-32"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.25)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isPanning ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsPanning(!isPanning)}
          >
            <Move className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy SVG
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-[500px] overflow-hidden rounded-lg border border-gray-200 bg-white"
        onMouseDown={handleMouseDown}
        style={{ cursor: isPanning ? 'move' : 'default' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
        <div 
          ref={contentRef}
          className={`mermaid absolute ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            transition: isDragging.current ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

const VisualizationTab = ({ visualization }: { visualization: string }) => {
  return (
    <TabsContent 
      value="visualization"
      className="w-full max-w-4xl mx-auto pt-6"
    >
      <Card className="shadow-lg">
        <CardContent className="p-6">
            {visualization ? (
              <MermaidRenderer value={visualization} />
            ) : (
              <div className="text-center text-gray-500 py-8">
                No visualization available
              </div>
            )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default VisualizationTab;