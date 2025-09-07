// src/components/TeamSection.tsx
import React from "react";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

interface Props {
  members: TeamMember[];
}

const TeamSection: React.FC<Props> = ({ members }) => {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">Meet Our Team</h2>
      <div className="space-y-12">
        {members.map((member, index) => (
          <div
            key={member.name}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <img
              src={member.image}
              alt={member.name}
              className="w-40 h-40 object-cover rounded-full shadow-md flex-shrink-0"
            />

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-green-600 font-medium mb-2">{member.role}</p>
              <p className="text-gray-700 leading-relaxed">{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
