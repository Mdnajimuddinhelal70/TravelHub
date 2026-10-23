import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const contactMethods = [
  {
    icon: Mail,
    label: "Email Us",
    value: "najimuddin77288@gmail.com",
    description: "For general questions and travel inquiries",
    href: "mailto:najimuddin77288@gmail.com",
    color: "bg-sky-100 text-sky-700",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "Contact our team",
    description: "For assistance with your travel plans",
    href: null,
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: MapPin,
    label: "Our Platform",
    value: "Travel with confidence",
    description: "Discover destinations and tour experiences",
    href: "/tours",
    color: "bg-cyan-100 text-cyan-700",
  },
];

const ContactFormSection = () => {
  return (
    <section
      id="contact-details"
      aria-labelledby="contact-details-heading"
      className="relative isolate overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-sky-200/30 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-200/30 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 shadow-sm">
            <Sparkles size={15} className="text-sky-600" />
            <span className="text-xs font-bold tracking-wide text-slate-700 sm:text-sm">
              WE&apos;RE HERE FOR YOU
            </span>
          </div>

          <h2
            id="contact-details-heading"
            className="text-balance text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Let&apos;s Start a{" "}
            <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Conversation
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Whether you have a question or need help planning your next
            adventure, send us a message. We&apos;d love to hear from you.
          </p>
        </div>

        {/* Main contact layout */}
        <div className="grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          {/* Contact information */}
          <aside className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-9 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/20 blur-[80px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[80px]"
            />

            <div className="relative">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner shadow-white/5">
                <MessageCircle size={26} className="text-cyan-300" />
              </div>

              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Get in touch with us
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                Every great journey begins with a conversation. Tell us what you
                have in mind, and let&apos;s explore the possibilities together.
              </p>

              <div className="mt-9 space-y-4">
                {contactMethods.map((method) => {
                  const Icon = method.icon;

                  return (
                    <div
                      key={method.label}
                      className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-white/20 hover:bg-white/[0.08] sm:p-5"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${method.color}`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                          {method.label}
                        </p>

                        {method.href ? (
                          <Link
                            href={method.href}
                            className="mt-1 inline-flex max-w-full items-center gap-1 break-words text-sm font-bold text-white transition hover:text-cyan-300 sm:text-base"
                          >
                            {method.value}
                            <ArrowUpRight
                              size={15}
                              className="shrink-0 opacity-70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </Link>
                        ) : (
                          <p className="mt-1 text-sm font-bold text-white sm:text-base">
                            {method.value}
                          </p>
                        )}

                        <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6">
                <Clock3 size={19} className="mt-0.5 shrink-0 text-cyan-300" />
                <div>
                  <p className="text-sm font-bold text-white">
                    We value your time
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Send us your question, and our team can follow up once
                    contact support is connected.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-9 lg:p-10">
            <div className="mb-8">
              <p className="text-sm font-bold text-sky-700">SEND A MESSAGE</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                How can we help?
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Fill in the details below. All fields are required.
              </p>
            </div>

            <form
              id="contact-form"
              action="#contact-form"
              method="get"
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    required
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What would you like to discuss?"
                  required
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  minLength={10}
                  placeholder="Tell us a little about how we can help..."
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Please enter at least 10 characters.
                </p>
              </div>

              <button
                type="submit"
                className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                Send Message
                <Send
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                />
              </button>

              <div className="flex items-start justify-center gap-2 text-center">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <p className="text-xs leading-5 text-slate-500">
                  Your information should be handled securely when the form
                  submission service is connected.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
