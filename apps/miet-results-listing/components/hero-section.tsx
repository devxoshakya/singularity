import Link from "next/link";
import { LinkPreview } from "./ui/link-preview";
import { Github } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-2">
      <h1 className="mt-8 max-w-4xl mx-auto text-balance md:text-5xl text-4xl">
        MIET Results Listing
      </h1>
      <div className="mx-auto mt-8 max-w-2xl text-balance text-sm font-mono">
        Part of the revolutionary{" "}
        <LinkPreview
          url="https://github.com/devxoshakya/singularity"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 to-purple-200"
          imageSrc="/singularity.png"
          isStatic
        >
          Singularity Project
        </LinkPreview>
        {""}, this results portal is built by{" "}
        <LinkPreview
          url="https://devshakya.xyz"
          className="font-bold"
          imageSrc="/dev.png"
          isStatic
        >
          Dev Shakya{" "}
        </LinkPreview>{" "}
        and{" "}
        <LinkPreview
          url="https://akshita.xyz"
          className="font-bold"
          imageSrc="/akshita.png"
          isStatic
        >
          Akshita Srivastava
        </LinkPreview>{" "}
        — engineered to deliver academic results faster, cleaner, and smarter
        than anything your institute ever imagined.
        <br />
        {""}
      </div>
      <span className="mt-1">
        ⭐ Don’t just use it — star the
        <Link
          href="https://github.com/devxoshakya/singularity"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="inline-block ml-1 h-6 w-6 bg-black text-white p-1 rounded-full" />{" "}
          GitHub repo
        </Link>
      </span>
      <div className="mx-auto mt-6 max-w-2xl text-balance text-sm font-mono">
        We take no guarantee of the information displayed below. Please check
        the official{" "}
        <Link
          href={"https://oneview.aktu.ac.in/WebPages/aktu/OneView.aspx"}
          className="text-blue-500 font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          AKTU Website
        </Link>{" "}
        for your result.{" "}
        
      </div>
    </section>
  );
}
