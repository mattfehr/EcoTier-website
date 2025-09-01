import React from "react";

interface Information {
    title:string;
    description: string;
    imageUrls: string[];
}

interface Props {
  section: Information;
}

const AeroponicInfo: React.FC<Props> = ({section}) => {
  return (
    <section className="bg-green-700 py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-start gap-10">
        {/* Text Content (Left) */}
        <div className="lg:w-1/2 w-full">
          <h2 className="text-3xl font-bold text-white mb-4">
            {section.title}
          </h2>
          <p className="text-green-100 text-lg leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Image Gallery (Right) */}
        <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
          {section.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Product image ${index + 1}`}
              className="w-full h-40 object-cover rounded-md shadow-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AeroponicInfo;