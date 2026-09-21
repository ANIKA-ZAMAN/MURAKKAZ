"use client";

import { useState } from "react";
import Link from "next/link";
import { storeLocations } from "../data/eventsData";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Consultation",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setIsSubmitting(true);
    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Consultation",
        message: "",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#313134] py-14 sm:py-20 px-4 sm:px-8 md:px-14 lg:px-20 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-[12px] uppercase tracking-[0.25em] text-[#820011] font-medium font-serif block mb-3">
          Concierge &amp; Inquiries
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#2B2B2E] mb-4">
          Contact Murakkaz
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#7A746A] font-serif-text leading-relaxed">
          Whether you seek personal fragrance recommendations, bespoke blending inquiries, corporate gifting, or retail boutique support, our concierge team is at your service.
        </p>
      </div>

      {/* Direct Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-18">
        {/* WhatsApp Card */}
        <a
          href="https://wa.me/8801997807701?text=Hello%20Murakkaz,%20I%20would%20like%20to%20inquire%20about%20your%20fragrances."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/85 hover:bg-white border border-[#E2D5C3] hover:border-[#820011]/40 rounded-2xl p-6 transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-[#EAF7EE] text-[#25D366] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.461 3.486 1.336 5.006L2 22l5.127-1.345c1.472.802 3.125 1.226 4.869 1.228h.004c5.51 0 9.993-4.483 9.993-9.993 0-2.67-1.04-5.18-2.93-7.07A9.924 9.924 0 0 0 12.004 2zm6.758 13.916c-.278.78-1.618 1.528-2.222 1.62-.554.084-1.284.144-3.413-.744-2.723-1.135-4.478-3.905-4.613-4.088-.135-.183-1.099-1.464-1.099-2.793 0-1.33.697-1.982.94-2.25.244-.268.532-.335.71-.335.178 0 .355.002.51.01.164.007.385-.026.6.495.222.534.755 1.84.82 1.975.067.135.112.293.023.473-.09.18-.135.293-.267.45-.133.157-.28.35-.4.473-.135.138-.277.29-.12.56.157.27.7 1.15 1.502 1.866.802.715 1.478.937 1.77 1.05.292.115.461.097.633-.1.173-.198.754-.875.955-1.173.2-.3.4-.249.675-.15.278.1 1.758.877 2.062 1.03 2.361 1.18.298.15.496.223.574.356.078.13.078.752-.2 1.532z" />
              </svg>
            </div>
            <h3 className="font-serif text-[17px] font-medium text-[#2B2B2E] mb-1">WhatsApp Concierge</h3>
            <p className="font-serif-text text-[13px] text-[#7A746A] leading-snug">
              Instant chat for order support, discovery advice &amp; gift consulting.
            </p>
          </div>
          <span className="font-serif-text text-[13px] text-[#820011] font-semibold mt-4 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Chat on WhatsApp <span>&rarr;</span>
          </span>
        </a>

        {/* Messenger Card */}
        <a
          href="https://www.facebook.com/messages/t/108212200714838"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/85 hover:bg-white border border-[#E2D5C3] hover:border-[#820011]/40 rounded-2xl p-6 transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-[#EBF3FF] text-[#0084FF] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.45 5.513 3.722 7.158V22l3.415-1.874a11.1 11.1 0 002.863.372c5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.096 12.35l-2.613-2.79-5.1 2.79 5.603-5.952 2.67 2.79 5.044-2.79-5.604 5.952z" />
              </svg>
            </div>
            <h3 className="font-serif text-[17px] font-medium text-[#2B2B2E] mb-1">Messenger Support</h3>
            <p className="font-serif-text text-[13px] text-[#7A746A] leading-snug">
              Direct message our Dhaka community desk on Facebook Messenger.
            </p>
          </div>
          <span className="font-serif-text text-[13px] text-[#820011] font-semibold mt-4 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Open Messenger <span>&rarr;</span>
          </span>
        </a>

        {/* Email Card */}
        <a
          href="mailto:re@murakkaz.com"
          className="bg-white/85 hover:bg-white border border-[#E2D5C3] hover:border-[#820011]/40 rounded-2xl p-6 transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-[#F5EEE2] text-[#820011] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-[17px] font-medium text-[#2B2B2E] mb-1">Email Concierge</h3>
            <p className="font-serif-text text-[13px] text-[#7A746A] leading-snug">
              re@murakkaz.com for formal partnerships, press inquiries &amp; feedback.
            </p>
          </div>
          <span className="font-serif-text text-[13px] text-[#820011] font-semibold mt-4 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Send Email <span>&rarr;</span>
          </span>
        </a>

        {/* Studio Phone Card */}
        <a
          href="tel:+8801997807701"
          className="bg-white/85 hover:bg-white border border-[#E2D5C3] hover:border-[#820011]/40 rounded-2xl p-6 transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-full bg-[#F5EEE2] text-[#820011] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-serif text-[17px] font-medium text-[#2B2B2E] mb-1">Direct Call</h3>
            <p className="font-serif-text text-[13px] text-[#7A746A] leading-snug">
              +880 1997-807701 (Saturday &ndash; Thursday, 10am &ndash; 9pm).
            </p>
          </div>
          <span className="font-serif-text text-[13px] text-[#820011] font-semibold mt-4 flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Call Atelier <span>&rarr;</span>
          </span>
        </a>
      </div>

      {/* Main Grid: Inquiry Form (Left) & Boutique Locations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Left: Contact & Message Form */}
        <div className="lg:col-span-7 bg-white/90 rounded-3xl p-6 sm:p-10 border border-[#E2D5C3] shadow-xs">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#820011] font-serif font-medium block mb-2">
            Send an Inquiry
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2B2B2E] mb-2 font-medium">
            Let&apos;s Discuss Your Signature Scent
          </h2>
          <p className="font-serif-text text-[14px] text-[#7A746A] mb-8 leading-relaxed">
            Fill out the form below and an olfactory consultant will reach out within 24 hours.
          </p>

          {isSubmitted ? (
            <div className="bg-[#FAF6F0] border border-[#C5A880]/50 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#820011] text-white flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-[#2B2B2E] font-medium mb-2">Inquiry Received</h3>
              <p className="font-serif-text text-[14px] text-[#6A645A] max-w-md mx-auto mb-6 leading-relaxed">
                Thank you for reaching out to Murakkaz. A member of our concierge team will contact you shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="font-serif-text text-[13px] text-[#820011] font-semibold hover:underline"
              >
                Send Another Message &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-[12.5px] uppercase tracking-[0.08em] font-serif font-medium text-[#4A4A4C] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#FAF7F2] border border-[#DDD4C5] focus:border-[#820011] rounded-xl px-4 py-3 text-[14px] font-serif-text text-[#2B2B2E] placeholder-[#9E978C] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-[12.5px] uppercase tracking-[0.08em] font-serif font-medium text-[#4A4A4C] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#DDD4C5] focus:border-[#820011] rounded-xl px-4 py-3 text-[14px] font-serif-text text-[#2B2B2E] placeholder-[#9E978C] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-[12.5px] uppercase tracking-[0.08em] font-serif font-medium text-[#4A4A4C] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1..."
                    className="w-full bg-[#FAF7F2] border border-[#DDD4C5] focus:border-[#820011] rounded-xl px-4 py-3 text-[14px] font-serif-text text-[#2B2B2E] placeholder-[#9E978C] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-[12.5px] uppercase tracking-[0.08em] font-serif font-medium text-[#4A4A4C] mb-1.5">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD4C5] focus:border-[#820011] rounded-xl px-4 py-3 text-[14px] font-serif-text text-[#2B2B2E] focus:outline-none transition-colors"
                  >
                    <option value="General Consultation">General Scent Consultation</option>
                    <option value="Order & Delivery">Order &amp; Delivery Tracking</option>
                    <option value="Corporate Gifting">Corporate Gifting &amp; Events</option>
                    <option value="Bespoke Blending">Bespoke Workshop Inquiries</option>
                    <option value="Wholesale">Wholesale &amp; Distribution</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-[12.5px] uppercase tracking-[0.08em] font-serif font-medium text-[#4A4A4C] mb-1.5">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How may we assist your fragrance journey?"
                  className="w-full bg-[#FAF7F2] border border-[#DDD4C5] focus:border-[#820011] rounded-xl p-4 text-[14px] font-serif-text text-[#2B2B2E] placeholder-[#9E978C] focus:outline-none transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#820011] hover:bg-[#6C000E] text-white font-serif-text font-medium text-[14px] tracking-[0.08em] uppercase py-3.5 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Submit Inquiry →"}
              </button>
            </form>
          )}
        </div>

        {/* Right: Boutique Locations & Visiting Hours */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#820011] font-serif font-medium block mb-2">
              Physical Boutiques
            </span>
            <h3 className="font-serif text-2xl text-[#2B2B2E] font-medium mb-4">
              Visit Murakkaz in Dhaka
            </h3>
            <p className="font-serif-text text-[13.5px] text-[#7A746A] leading-relaxed mb-6">
              Experience our perfume concentrates and natural notes firsthand at our authorized pavilions and concept spaces.
            </p>

            <div className="space-y-4">
              {storeLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl p-4.5 hover:border-[#820011]/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif text-[15px] font-medium text-[#2B2B2E]">
                      {loc.zone}
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[0.1em] text-[#820011] font-mono font-bold bg-[#820011]/8 px-2 py-0.5 rounded-full">
                      Location {loc.id}
                    </span>
                  </div>
                  <p className="font-serif-text text-[12.5px] text-[#6A645A] leading-snug mb-2">
                    {loc.address}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-[#8A8477] font-mono">
                    <span>Opening Hours: 10:00 AM &ndash; 9:00 PM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ / Note Box */}
          <div className="bg-gradient-to-br from-[#820011] to-[#5a000c] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <h4 className="font-serif text-xl font-medium mb-2">
              Bespoke Fragrance Blending
            </h4>
            <p className="font-serif-text text-[13.5px] text-white/85 leading-relaxed mb-4">
              Interested in custom wedding perfume favors, bespoke signature extraits, or curated corporate gifts? Let our chief perfumer handcraft your olfactory story.
            </p>
            <a
              href="https://wa.me/8801997807701?text=Hello%20Murakkaz,%20I'd%20like%20to%20discuss%20a%20bespoke%20fragrance%20collaboration."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.1em] font-serif-text font-bold bg-white text-[#820011] px-5 py-2.5 rounded-full hover:bg-[#FAF6F0] transition-colors shadow-xs"
            >
              Consult with Perfumer &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
