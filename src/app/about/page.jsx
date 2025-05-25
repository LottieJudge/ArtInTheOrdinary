import About from "@/components/About";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "About us",
    description: "Our story and mission",
    keywords: "About, Company, Mission, Story, Team, Values, Culture, History",
  };

export default function AboutPage() {
return (
    <>
        <About />
    </>
  );
}