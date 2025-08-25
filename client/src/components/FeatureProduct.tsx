import React, { useEffect, useState, useRef, useMemo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Type definitions
interface CarouselItem {
  id: string | number;
  imageUrl: string;
  title: string;
}

interface CarouselProps {
  data?: CarouselItem[];
  duration?: number;
}

// Utility function with proper typing
function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return twMerge(clsx(inputs));
}

const Carousel: React.FC<CarouselProps> = ({ data = [], duration = 4900 }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasData = useMemo(() => Boolean(data.length), [data]);

  useEffect(() => {
    if (!data.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
      setProgress(10);
    }, duration);

    return () => clearInterval(interval);
  }, [data, duration]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 100 / (duration / 100);
        if (nextProgress >= 100) clearInterval(progressInterval);

        return nextProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentIndex, duration]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  return (
    <div className="w-full h-[300px] flex flex-col hover:bg-white/10 duration-300 ease-in-out group overflow-hidden">
      <div className="relative w-full h-full">
        {!hasData && <div>default image...</div>}
        {hasData &&
          data.map((item, index) => (
            <div
              key={item?.id}
              className={cn(
                `flex flex-col w-full h-full absolute transition-opacity duration-1000 cursor-pointer`,
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="w-full h-[340px] group-hover:scale-110 transition-all duration-300 ease-in-out">
                <div
                  style={{
                    backgroundImage: `url('${item?.imageUrl}')`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
              <div className="w-full text-left text-base tracking-wider leading-7 text-green-600 py-4 px-4">
                {item?.title}
              </div>
            </div>
          ))}
      </div>

      {hasData && (
        <div className="gap-1.5 w-full p-0 px-4 pb-4 flex">
          {data.map((item, index) => {
            const isActive = currentIndex === index;
            return (
              <div
                key={`${item?.id}-${index}`}
                className={cn(
                  "overflow-hidden relative shrink-0 h-2 bg-white bg-opacity-30 rounded-full",
                  isActive ? "w-[30px]" : "w-2"
                )}
              >
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-transparent rounded-full">
                    <div
                      ref={progressRef}
                      className="h-full bg-green-600 rounded-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Carousel;