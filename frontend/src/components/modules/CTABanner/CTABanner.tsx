"use client";

import { Button } from "@/components/ui/button";

export default function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-center text-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Start Your Adventure?
        </h2>
        <p className="text-lg mb-8">
          Sign up today and explore amazing destinations with trusted guides.
        </p>
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
        >
          Join Now
        </Button>
      </div>
    </section>
  );
}
