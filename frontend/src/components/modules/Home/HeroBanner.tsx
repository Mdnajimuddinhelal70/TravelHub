"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import bannerImg from "../../../../public/assets/bannerImg/img4.png";

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bannerImg}
          alt="Hero Banner"
          width={1920}
          height={800}
          className="object-cover object-center w-full h-[800px]"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 rounded-lg text-black max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Embark on Your Next Adventure
        </h1>
        <p className="text-lg mb-6">
          Discover amazing destinations with trusted guides and seamless
          booking.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Plan Your Trip
        </Button>
      </div>
    </section>
  );
}
