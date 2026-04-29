"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarCheck, Map, Smile, UserPlus } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="w-12 h-12 text-blue-600" />,
      title: "Sign Up",
      description: "Create your account in just a few seconds.",
    },
    {
      icon: <Map className="w-12 h-12 text-green-600" />,
      title: "Choose Guide",
      description: "Select from trusted guides for your journey.",
    },
    {
      icon: <CalendarCheck className="w-12 h-12 text-purple-600" />,
      title: "Book Trip",
      description: "Confirm your booking with secure payment.",
    },
    {
      icon: <Smile className="w-12 h-12 text-pink-600" />,
      title: "Enjoy Tour",
      description: "Experience unforgettable adventures with ease.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 rounded-xl"
            >
              <CardHeader className="flex flex-col items-center p-8">
                <div className="mb-4">{step.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-700">
                  {step.title}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-500">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
