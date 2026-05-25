// ============================================================
// FILE 24 — app/contact/page.tsx  (REPLACES File 14)
// Place at: app/contact/page.tsx
// ============================================================

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Sun, MessageCircle, Instagram, Facebook, Youtube, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ADMIN = {
  name: "Abubakar",
  phone: "+92 309 0003841",
  email: "abuxusman911@gmail.com",
};

const OFFICES = [
  {
    city: "Lahore — Head Office",
    address: "123 Gulberg III, Main Boulevard, Lahore, Punjab 54660",
    phone: ADMIN.phone,
    mobile: ADMIN.phone,
    email: ADMIN.email,
    contact: ADMIN.name,
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    isMain: true,
  },
  {
    city: "Karachi",
    address: "456 Clifton Block 5, Karachi, Sindh 75600",
    phone: ADMIN.phone,
    mobile: ADMIN.phone,
    email: ADMIN.email,
    contact: ADMIN.name,
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    isMain: false,
  },
  {
    city: "Islamabad",
    address: "789 Blue Area, Jinnah Avenue, Islamabad 44000",
    phone: ADMIN.phone,
    mobile: ADMIN.phone,
    email: ADMIN.email,
    contact: ADMIN.name,
    hours: "Mon–Sat: 9:00 AM – 6:00 PM",
    isMain: false,
  },
];

const SOCIALS = [
  {
    name: "WhatsApp",
    handle: `${ADMIN.phone} (${ADMIN.name})`,
    href: "https://wa.me/923090003841",
    color: "bg-green-500 hover:bg-green-600",
    icon: MessageCircle,
    desc: "Chat with us directly",
  },
  {
    name: "Instagram",
    handle: "@SolarProPakistan",
    href: "https://instagram.com/SolarProPakistan",
    color: "bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500",
    icon: Instagram,
    desc: "Follow our installations",
  },
  {
    name: "Facebook",
    handle: "SolarPro Pakistan",
    href: "https://facebook.com/SolarProPakistan",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: Facebook,
    desc: "Join our community",
  },
  {
    name: "YouTube",
    handle: "SolarPro PK",
    href: "https://youtube.com/@SolarProPK",
    color: "bg-red-600 hover:bg-red-700",
    icon: Youtube,
    desc: "Watch installation guides",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/20">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-700 py-16">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-600/30 animate-spin-slow" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center animate-fade-in-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-emerald-100">
            <MapPin className="h-4 w-4" /> 3 Offices Across Pakistan
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Get In Touch</h1>
          <p className="mt-3 text-emerald-200 max-w-lg mx-auto">
            We're here to help with solar installations, net metering, and free site surveys across Pakistan.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/923090003841" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors shadow-lg">
              <MessageCircle className="h-4 w-4" /> WhatsApp Us Now
            </a>
            <a href="tel:+923090003841"
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors">
              <Phone className="h-4 w-4" /> Call Us
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">

        {/* ── Social Media ── */}
        <section className="animate-fade-in-up">
          <h2 className="mb-6 text-xl font-bold text-emerald-900 text-center">Find Us On Social Media</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-3 rounded-2xl p-6 text-white transition-all duration-200 hover:scale-105 hover:shadow-xl ${s.color}`}
              >
                <s.icon className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-bold">{s.name}</p>
                  <p className="text-sm opacity-90">{s.handle}</p>
                  <p className="text-xs opacity-70 mt-1">{s.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Offices + Form ── */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Offices */}
          <div className="space-y-5 animate-fade-in-up delay-200">
            <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" /> Our Offices
            </h2>
            {OFFICES.map((office) => (
              <div
                key={office.city}
                className={`rounded-2xl border p-5 transition-all hover:shadow-md ${
                  office.isMain
                    ? "border-emerald-300 bg-gradient-to-br from-emerald-700 to-emerald-800 text-white"
                    : "border-emerald-100 bg-white"
                }`}
              >
                {office.isMain && (
                  <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-emerald-100">
                    Head Office
                  </span>
                )}
                <h3 className={`font-bold text-base mb-3 ${office.isMain ? "text-white" : "text-emerald-900"}`}>
                  {office.city}
                </h3>
                {office.contact && (
                  <p className={`text-sm mb-2 ${office.isMain ? "text-emerald-100" : "text-slate-600"}`}>
                    Contact: <span className="font-semibold">{office.contact}</span>
                  </p>
                )}
                <div className="space-y-2">
                  {[
                    { icon: MapPin, text: office.address },
                    { icon: Phone, text: `${office.phone} · ${office.mobile}` },
                    { icon: Mail, text: office.email },
                    { icon: Clock, text: office.hours },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <item.icon className={`mt-0.5 h-4 w-4 shrink-0 ${office.isMain ? "text-emerald-200" : "text-emerald-500"}`} />
                      <p className={`text-sm ${office.isMain ? "text-emerald-100" : "text-slate-600"}`}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl border border-emerald-100">
              <div className="bg-emerald-700 px-4 py-2.5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-200" />
                <span className="text-sm font-medium text-white">Lahore Head Office</span>
              </div>
              <div className="h-48 bg-emerald-50 flex flex-col items-center justify-center gap-3">
                <MapPin className="h-10 w-10 text-emerald-400 animate-float" />
                <p className="text-sm text-slate-500">Gulberg III, Lahore</p>
                <a
                  href="https://maps.google.com/?q=Gulberg+III+Lahore+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 transition-colors"
                >
                  <MapPin className="h-3 w-3" /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in-up delay-300">
            <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-900 mb-1">Send a Message</h2>
              <p className="text-sm text-slate-500 mb-6">We reply within 24 hours</p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Ahmed Khan" className="border-emerald-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+92 300 0000000" className="border-emerald-200" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="ahmed@example.com" className="border-emerald-200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="Lahore, Karachi, Islamabad..." className="border-emerald-200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="service">Service Required</Label>
                  <select id="service" name="service"
                    className="flex h-10 w-full rounded-lg border border-emerald-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Select a service...</option>
                    <option>Residential Solar Installation</option>
                    <option>Commercial Solar Installation</option>
                    <option>Net Metering Application</option>
                    <option>Free Site Survey</option>
                    <option>System Maintenance</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={4} placeholder="Tell us about your project — monthly bill, roof type, location..." className="resize-none border-emerald-200" />
                </div>
                <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold h-11">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <p className="text-center text-xs text-slate-400">
                  Or message us on{" "}
                  <a href="https://wa.me/923090003841" className="text-green-600 font-semibold hover:underline">
                    WhatsApp
                  </a>{" "}
                  for instant reply
                </p>
              </form>
            </div>

            {/* Emergency */}
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Emergency / After-hours</p>
                <a href={`tel:${ADMIN.phone}`} className="text-sm text-amber-700 hover:underline font-medium">
                  {ADMIN.phone} ({ADMIN.name}) — 24/7
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sun className="h-5 w-5 text-amber-400" />
          <span className="font-bold text-emerald-900">SolarPro Pakistan</span>
        </div>
        <p className="text-xs text-slate-600 mb-2">Contact: {ADMIN.name} | {ADMIN.email}</p>
        <p className="text-xs text-slate-400">AEDB Certified · WAPDA Approved · NEPRA Compliant</p>
      </footer>
    </div>
  );
}

export const metadata = {
  title: "Contact Us | SolarPro Pakistan",
};
