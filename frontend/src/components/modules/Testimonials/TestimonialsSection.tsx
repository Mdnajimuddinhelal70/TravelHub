"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import img1 from "../../../../public/assets/testimonials/travel1.webp";
import img2 from "../../../../public/assets/testimonials/travel2.webp";
import img3 from "../../../../public/assets/testimonials/travel3.jpg";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Krishan Kumar",
      feedback: "This platform made my trip booking so easy and stress-free!",
      image: img1.src,
    },
    {
      name: "Sanjay Singh",
      feedback: "Trusted guides and secure payments gave me peace of mind.",
      image: img2.src,
    },
    {
      name: "Ayesha Rahman",
      feedback:
        "Loved the smooth experience and professional support throughout my journey.",
      image: img3.src,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 rounded-xl bg-white"
            >
              <CardHeader className="flex flex-col items-center p-8">
                <Avatar className="w-16 h-16 mb-4">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-semibold text-gray-700">
                  {testimonial.name}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-500 italic">
                  {testimonial.feedback}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
