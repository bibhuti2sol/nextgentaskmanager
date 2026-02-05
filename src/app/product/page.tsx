"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const features = [
  "Task Management",
  "Project Management",
  "Chat Discussions",
  "Doc And Attachment",
  "Workflow Management",
  "Time Sheet",
  "Reports",
  "Integration",
  "Additional Features",
  "Task Delegation",
  "To Do List",
  "Task Planner",
  "Task Tracker",
  "Attendance Management",
  "Leave Management",
];

const industries = [
  "Manufacturing Industry",
  "Real Estate and Construction Sector",
  "CA/CS/CFA",
  "Event Management",
  "IT Industry",
  "Education Sector",
  "Law Firms",
  "Service Sector & Consulting Firms",
  "BPO & KPO Firms",
  "Healthcare & Hospitals",
];

export default function ProductMainPage() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col scroll-smooth relative overflow-x-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-80px] left-[-120px] w-[340px] h-[340px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-[180px] h-[180px] bg-success/10 rounded-full blur-2xl" />
      </div>
      {/* Header */}
      <header className="w-full bg-white/90 border-b border-border shadow-lg flex items-center justify-between px-8 py-4 sticky top-0 z-20 backdrop-blur-md">
        <Link href="/#" className="flex items-center gap-3">
          <Image src="/assets/images/logo.svg" alt="NextGenTask Logo" width={44} height={44} className="h-11 w-11" />
          <span className="text-2xl font-bold text-primary">NextGenTask</span>
          <span className="text-xs font-semibold text-success ml-2">BE ORGANIZED</span>
        </Link>
        <nav className="flex gap-6 items-center">
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(featuresRef)}>Features</button>
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(industriesRef)}>Industries</button>
          <Link href="/signup" className="text-base font-medium text-primary hover:text-accent transition">Pricing</Link>
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(blogRef)}>Blog</button>
          <button className="text-base font-medium text-primary hover:text-accent transition" onClick={() => scrollTo(contactRef)}>Contact Us</button>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-primary to-accent text-white font-semibold px-5 py-2 rounded-full shadow hover:scale-105 transition">Demo</button>
          </Link>
          <Link href="/login">
            <button className="border border-primary text-primary font-semibold px-5 py-2 rounded-full hover:bg-primary/10 transition">Account</button>
          </Link>
        </nav>
      </header>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto py-20 px-6 gap-8 relative z-10">
        <div className="flex-1 flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight drop-shadow-lg animate-fade-in">
            NextGenTask Manager
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-accent mb-4 animate-fade-in">Understand Our Core Features</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg animate-fade-in">
            Take advantage of a range of features that help you and your team become organised and productive. Experience seamless task management, efficient project planning, and effective communication—all in one user-friendly platform.
          </p>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-primary to-accent text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all animate-fade-in">Get Started</button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center relative">
          <div className="rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-success/20 w-80 h-80 flex items-center justify-center shadow-2xl border-4 border-accent/30 animate-fade-in">
            {/* Add your illustration here if available */}
            {/* Optionally add an Image here for hero illustration */}
            <div className="absolute top-8 left-8 w-16 h-2 bg-primary/30 rounded-full" />
            <div className="absolute bottom-8 right-8 w-10 h-10 border-2 border-primary/20 rounded-full" />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section ref={featuresRef} id="features" className="w-full max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-primary mb-8 text-center drop-shadow-lg animate-fade-in">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature} className="bg-gradient-to-br from-white via-primary/5 to-accent/10 rounded-2xl border border-primary/10 shadow-lg p-8 flex items-center justify-center text-primary font-semibold text-lg hover:scale-105 hover:bg-primary/10 transition-all text-center animate-fade-in">
              {feature}
            </div>
          ))}
        </div>
      </section>
      {/* Industries Section */}
      <section ref={industriesRef} id="industries" className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-accent mb-8 text-center drop-shadow-lg animate-fade-in">Industries We Serve</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
          {industries.map((industry) => (
            <li key={industry} className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-xl border border-accent/20 shadow p-6 text-primary font-semibold hover:scale-105 hover:bg-accent/10 transition-all animate-fade-in">
              {industry}
            </li>
          ))}
        </ul>
      </section>
      {/* Pricing Section (links to signup) */}
      <section ref={pricingRef} id="pricing" className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center drop-shadow-lg animate-fade-in">Pricing</h2>
        <div className="flex flex-col items-center">
          <p className="mb-6 text-lg text-muted-foreground text-center animate-fade-in">See our flexible plans and get started for free.</p>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-primary to-accent text-white font-bold px-10 py-4 rounded-full shadow-lg hover:scale-105 transition-all animate-fade-in">View Pricing & Sign Up</button>
          </Link>
        </div>
      </section>
      {/* Blog Section */}
      <section ref={blogRef} id="blog" className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center drop-shadow-lg animate-fade-in">Blog</h2>
        <div className="flex flex-col items-center">
          <p className="mb-6 text-lg text-muted-foreground text-center animate-fade-in">Coming soon: Insights, tips, and updates from the NextGenTask team.</p>
        </div>
      </section>
      {/* Contact Us Section */}
      <section ref={contactRef} id="contact" className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-accent mb-8 text-center drop-shadow-lg animate-fade-in">Contact Us</h2>
        <div className="flex flex-col items-center">
          <p className="mb-6 text-lg text-muted-foreground text-center animate-fade-in">For inquiries, partnerships, or support, email us at <a href="mailto:support@nextgentask.com" className="text-accent underline">support@nextgentask.com</a></p>
        </div>
      </section>
    </main>
  );
}
