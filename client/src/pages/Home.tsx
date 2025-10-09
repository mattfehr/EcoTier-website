// src/pages/Home.tsx
import { useEffect, useState } from "react";
import FeatureProduct from "../components/FeatureProduct";
import CompanyFeatures from "../components/CompanyFeatures";
import AeroponicInfo from "../components/AeroponicInfo";
import AeroponicDiagram from "../assets/aeroponicsdiagram.jpg";
import Aeroponics from "../assets/aeroponics.jpg";
import TeamSection from "../components/TeamSection";
import Matthew from "../assets/matthew.png";
import Grace from "../assets/grace.jpg";
import Loc from "../assets/loc2.png";
import Joshua from "../assets/joshuajpg.jpg";
import Jared from "../assets/jared.jpg";
import Gaby from "../assets/gaby.png";
import Reese from "../assets/reese.jpg";

type Product = {
  productID: number;
  name: string;
  price: number;
  imageURL?: string;
};

const teamMembers = [
  {
    name: "Matthew Fehr",
    role: "Software Engineer",
    description:
      "I attend California State University, Long Beach as a Computer Science major focusing on machine learning and AI. I aspire to be a software engineer, machine learning engineer, data scientist or anything along those lines. I will be focusing on the software such as a tool for customization or an app for controls and monitoring.",
    image: Matthew, 
  },
  {
    name: "Grace Li",
    role: "Software Engineer",
    description:
      "I am a third year Computer Science major at San Jose State University with interest in machine learning, computer vision, and software development. In this project, I will focus on helping with the software part.",
    image: Grace, 
  },
  {
    name: "Loc Nguyen",
    role: "Mechanical Engineer",
    description:
      "I’m a fourth year Mechanical Engineering major at San Diego State University with a strong interest in working with military aircraft or robotics. In this project, I’m contributing to the development of a solution and assisting the team in building a prototype.",
    image: Loc, 
  },
  {
    name: "Joshua Gordian",
    role: "Electrical Engineer",
    description:
      "I recently graduated from Santa Ana College and will transfer to Cal Poly Pomona this fall as an Electrical Engineering major. Led the conduction of background research needed for the project and accumulated the various sources to support the proposal. I will also be focusing on helping with the technical design of the project.",
    image: Joshua,
  },
  {
    name: "Jared Redoblado",
    role: "Marketing & Data Analyst",
    description:
      "I am a Marketing major attending Cal State Fullerton, but I aspire to be a Marketing Data Analyst. I want to be able to analyze market trends within various industries and provide knowledge of consumer actions towards their purchases to these industries. Within this project, I helped research who our target consumer market is for our proposal, and researched the total addressable and serviceable market of our product with the help of my colleagues.",
    image: Jared,
  },
  {
    name: "Gabriela Quintana",
    role: "Informatics Specialist",
    description:
      "I am a fourth year Informatics major at UC Irvine, specializing in organizations and information technology. I plan to be a user interface/experience developer, or front end software developer. My contribution to the team includes taking a part in the solution development process, as well as researching sustainability and product impact.",
    image: Gaby,
  },
  {
    name: "Reese Catron",
    role: "Civil Engineer",
    description:
      "I am a third year civil engineering major at San Diego State University and plan to become a structural engineer. For this project, I designed the team name and logo and researched the impact of our product.",
    image: Reese,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const featuresData = [
    {
      title: "Varied Plants",
      description: "Grow leafy greens, herbs, and even fruits with a single system.",
    },
    {
      title: "Customization",
      description: "Mix towers, modules, and add-ons to design your perfect setup.",
    },
    {
      title: "Affordable price",
      description: "Eco-friendly food production at a fraction of the cost.",
    },
  ];

  const infos = {
    title: "About Aeroponic Vertical Farming",
    description:
      "Aeroponics is a method of growing plants without soil, where roots are suspended in the air and misted with a nutrient-rich solution. This technique uses up to 90% less water than traditional farming, speeds up plant growth, and allows for dense, vertical systems that are perfect for urban or indoor environments.",
    imageUrls: [
      AeroponicDiagram,
      Aeroponics,
    ],
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?sort=new&order=desc`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Product[] = await res.json();
        setProducts(data.slice(0, 5)); // only take first 5 for featured
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome to EcoTier Solutions
      </h1>

      <div>
        {/* ✅ pass backend products to FeatureProduct */}
        <FeatureProduct products={products} loading={loading} />
      </div>

      <div>
        <CompanyFeatures features={featuresData} />
      </div>

      <div>
        <AeroponicInfo section={infos} />
      </div>

      <div>
        <TeamSection members={teamMembers} />
      </div>

    </div>
  );
}
