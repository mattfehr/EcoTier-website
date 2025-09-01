// CompanyFeatures.tsx
import React from "react";

interface CompanyFeature{
    title: string;
    description:string;
}

interface Props {
  features: CompanyFeature[];
}

const CompanyFeatures: React.FC<Props> = ({ features }) => {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">
        Why Choose Us?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompanyFeatures;
