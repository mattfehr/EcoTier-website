import React, { useEffect, useState, useRef, useMemo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

type Product = {
  productID: number;
  name: string;
  price: number;
  imageURL?: string;
};

interface Props {
  products: Product[];
  loading?: boolean;
}

function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return twMerge(clsx(inputs));
}

const FeatureProduct: React.FC<Props> = ({ products, loading }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasData = useMemo(() => Boolean(products.length), [products]);
  const navigate = useNavigate();

  const duration = 4900;

  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      setProgress(10);
    }, duration);
    return () => clearInterval(interval);
  }, [products, duration]);

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
    <section className="max-w-6xl mx-auto mb-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading featured products...</p>
      ) : (
        <div className="w-full h-[300px] flex flex-col hover:bg-white/10 duration-300 ease-in-out group overflow-hidden">
          <div className="relative w-full h-full">
            {!hasData && <div>default image...</div>}
            {hasData &&
              products.map((item, index) => {
                const isActive = index === currentIndex;
                return (
                  <div
                    key={item.productID}
                    role="button"
                    tabIndex={0}
                    aria-hidden={!isActive}
                    onClick={() => isActive && navigate(`/product/${item.productID}`)}
                    onKeyDown={(e) => {
                      if (isActive && (e.key === "Enter" || e.key === " ")) {
                        navigate(`/product/${item.productID}`);
                      }
                    }}
                    className={cn(
                      "flex flex-col w-full h-full absolute transition-opacity duration-1000 cursor-pointer",
                      isActive
                        ? "opacity-100 pointer-events-auto z-10"
                        : "opacity-0 pointer-events-none z-0"
                    )}
                  >
                    <div className="w-full h-[340px] group-hover:scale-110 transition-all duration-300 ease-in-out">
                      <div
                        style={{
                          backgroundImage: `url('${
                            item.imageURL || "https://via.placeholder.com/1500x600"
                          }')`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded">
                      <span className="font-semibold">{item.name}</span> – $
                      {item.price.toFixed(2)}
                    </div>
                  </div>
                );
              })}
          </div>

          {hasData && (
            <div className="gap-1.5 w-full p-0 px-4 pb-4 flex">
              {products.map((item, index) => {
                const isActive = currentIndex === index;
                return (
                  <div
                    key={item.productID}
                    className={cn(
                      "overflow-hidden relative shrink-0 h-2 bg-white bg-opacity-30 rounded-full",
                      isActive ? "w-[30px]" : "w-2"
                    )}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default FeatureProduct;
