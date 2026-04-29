"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import bannerImg from "../../../../public/assets/testimonials/travel2.webp";

export default function AttractionSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Banner Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src={bannerImg}
            alt="Adventure Banner"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>

        {/* Right Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Discover the World with Us
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            From breathtaking landscapes to cultural wonders, our platform
            connects you with trusted guides and seamless booking options.
            Whether you’re planning a solo trip or a family adventure, we make
            sure your journey is smooth, memorable, and truly inspiring.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-fit">
            Explore Destinations
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
