"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Plane, Users } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Plane className="w-12 h-12 text-blue-600" />,
      title: "Easy Booking",
      description:
        "Book your trips quickly and securely with just a few clicks.",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-green-600" />,
      title: "Secure Payments",
      description:
        "Pay safely with multiple payment options and instant confirmation.",
    },
    {
      icon: <Users className="w-12 h-12 text-purple-600" />,
      title: "Trusted Guides",
      description:
        "Connect with experienced guides for unforgettable journeys.",
    },
  ];

  return (
    <section className="py-20 mt-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 bg-white rounded-xl"
            >
              <CardHeader className="flex flex-col items-center p-8">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-700">
                  {feature.title}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-500">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
