"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Plane,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";

const footerLinks = {
  explore: [
    { label: "Home", href: "/" },
    { label: "Explore Tours", href: "/tours" },
    { label: "Destinations", href: "/destinations" },
    { label: "About Us", href: "/about" },
  ],
  support: [
    { label: "My Bookings", href: "/my-bookings" },
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/najim-uddin-7994a1363/",
    icon: FaLinkedin,
  },
  {
    label: "Facebook",
    href: "https://web.facebook.com/najim.uddin.590919/",
    icon: FaFacebook,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/",
    icon: FaYoutube,
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    // Demo only: connect an email service or backend before launch.
    setMessage("Thanks for your interest! Newsletter signup is coming soon.");
    setEmail("");
  };

  return (
    <footer className="relative mt-3 isolate overflow-hidden bg-slate-950 text-white">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:26px_26px] opacity-[0.07]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative -mt-px overflow-hidden rounded-b-[2rem] rounded-t-none border-x border-b border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/80 px-5 py-9 shadow-2xl shadow-black/20 sm:px-8 sm:py-10 lg:px-12 lg:py-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2">
                <Send size={14} className="text-cyan-300" />
                <span className="text-[11px] font-bold tracking-[0.16em] text-cyan-200 uppercase">
                  The Travel Letter
                </span>
              </div>

              <h2 className="max-w-xl text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                A little inspiration.
                <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  A lot of adventure.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                Get inspired by extraordinary destinations, travel ideas, and
                special offers for your next journey.
              </p>
            </div>

            <div>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-xl sm:flex-row sm:items-center"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Your email address
                </label>

                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <Mail size={19} className="shrink-0 text-slate-400" />
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setMessage("");
                    }}
                    placeholder="Enter your email address"
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:from-cyan-400 hover:to-violet-500 hover:shadow-cyan-500/30 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Join Us
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>

              <p
                aria-live="polite"
                className="mt-3 min-h-5 text-xs leading-5 text-slate-400"
              >
                {message ||
                  "Newsletter signup is a demo until an email service is connected."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main footer */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-12 lg:py-16">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Travel Hub home"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 shadow-lg shadow-cyan-500/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <Plane size={23} className="text-white" strokeWidth={2.2} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-white">
                Travel
                <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                  Hub
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Discover extraordinary places, meaningful experiences, and
              unforgettable journeys. Your next adventure begins with Travel
              Hub.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
                <MapPin size={17} />
              </span>
              <span>Explore the world, your way.</span>
            </div>

            {/* Social links */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
                  >
                    <Icon
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">
              Explore
            </h3>

            <div className="mt-5 h-0.5 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />

            <ul className="mt-5 space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-all duration-300 group-hover:w-3 group-hover:bg-cyan-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">
              Travel Support
            </h3>

            <div className="mt-5 h-0.5 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />

            <ul className="mt-5 space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-cyan-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-all duration-300 group-hover:w-3 group-hover:bg-cyan-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">
              Get in Touch
            </h3>

            <div className="mt-5 h-0.5 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Have a question about your next trip? We would love to hear from
              you.
            </p>

            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors duration-300 hover:text-violet-300"
            >
              Contact our team
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.09]">
          <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-xs leading-6 text-slate-500 sm:text-left sm:text-sm">
              © {new Date().getFullYear()} Travel Hub. All rights reserved.
            </p>

            <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 sm:text-sm">
              Crafted for explorers, made with
              <Heart size={13} className="mx-0.5 fill-rose-400 text-rose-400" />
              and a passion for travel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
