'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Atom,
  Calendar,
  Clock,
  MapPin,
  Coffee,
  Sparkles,
  Lock,
  UserCheck,
  ShieldCheck,
  Users,
  Terminal,
  Building,
  GraduationCap,
  Phone
} from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    role: 'student',
  });

  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please check your inputs.');
      }

      setStatus({
        type: 'success',
        message: 'Registration Successful! We look forward to seeing you at the event.',
      });
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        institution: '',
        role: 'student',
      });
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-[#1A1A1A] selection:bg-[#8B5CF6] selection:text-white">

      {/* HEADER BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-[#EDEBF5] py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-48 overflow-hidden">
              <Image
                src="/assets/iar_logo.png"
                alt="IAR University Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="hidden md:inline-block h-6 w-px bg-gray-300"></span>
            <span className="text-xs md:text-sm font-semibold text-[#0B1533] uppercase tracking-wider">
              School of Humanities and Sciences
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#register-section"
              className="bg-[#5B2C9E] hover:bg-[#7B3FE4] text-white text-xs md:text-sm font-bold py-2 px-5 rounded-full shadow-lg shadow-[#5B2C9E]/20 transition duration-300 uppercase tracking-wide"
            >
              Register Now
            </a>
            <Link
              href="/admin"
              className="text-[#5B2C9E] hover:text-[#8B5CF6] text-xs font-semibold uppercase tracking-wider transition"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH QUANTUM THEME BACKGROUND */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1533] via-[#0e1b40] to-[#122457] text-white py-16 md:py-24 px-4 md:px-8">
        {/* Subtle decorative grid/quantum circuit effect */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#4DD8FF_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Left Glowing Quantum Sphere */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#4DD8FF] rounded-full blur-[120px] opacity-10 pointer-events-none animate-pulse"></div>
        {/* Right Bright Violet Glow */}
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[120px] opacity-15 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">

          {/* Badge / Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5B2C9E]/45 border border-[#8B5CF6]/50 text-[#4DD8FF] text-xs font-semibold tracking-wider uppercase mb-6 animate-bounce">
            <Atom className="w-4 h-4 text-[#4DD8FF] animate-spin" style={{ animationDuration: '4s' }} />
            Exclusive Guest Expert Talk
          </div>

          {/* Title and Tagline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6">
            Expert Talk on <br />
            <span className="bg-gradient-to-r from-[#4DD8FF] via-[#8B5CF6] to-[#7B3FE4] bg-clip-text text-transparent">
              Quantum Technology & Cryptography
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-gray-200 font-medium max-w-3xl mx-auto mb-8 text-balance">
            &ldquo;Exploring the Quantum Future. Securing the Digital World.&rdquo;
          </p>

          {/* Quick info badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-xs sm:text-sm">
            <div className="bg-[#FFFFFF]/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3 justify-center">
              <Calendar className="w-5 h-5 text-[#4DD8FF] shrink-0" />
              <div className="text-left">
                <p className="text-gray-400 text-[10px] uppercase font-bold">Date</p>
                <p className="font-semibold text-white">21 August 2026</p>
              </div>
            </div>

            <div className="bg-[#FFFFFF]/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3 justify-center">
              <Clock className="w-5 h-5 text-[#8B5CF6] shrink-0" />
              <div className="text-left">
                <p className="text-gray-400 text-[10px] uppercase font-bold">Time</p>
                <p className="font-semibold text-white">9:00 AM – 1:00 PM</p>
              </div>
            </div>

            <div className="bg-[#FFFFFF]/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3 justify-center col-span-2 sm:col-span-1">
              <MapPin className="w-5 h-5 text-[#4DD8FF] shrink-0" />
              <div className="text-left">
                <p className="text-gray-400 text-[10px] uppercase font-bold">Venue</p>
                <p className="font-semibold text-white">IAR Campus, Gandhinagar</p>
              </div>
            </div>

            <div className="bg-[#FFFFFF]/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3 justify-center col-span-2 sm:col-span-1">
              <Coffee className="w-5 h-5 text-[#8B5CF6] shrink-0 animate-pulse" />
              <div className="text-left">
                <p className="text-gray-400 text-[10px] uppercase font-bold">Key Highlight</p>
                <p className="font-semibold text-white">Networking Tea & Interaction</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#register-section"
              className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#7B3FE4] text-white font-bold py-3.5 px-8 rounded-full shadow-xl shadow-[#8B5CF6]/30 hover:scale-105 active:scale-95 transition text-center"
            >
              Secure Your Spot Now
            </a>
            <a
              href="#details-section"
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 border border-white/20 text-white font-semibold py-3.5 px-8 rounded-full transition text-center"
            >
              Learn More
            </a>
          </div>

        </div>
      </section>

      {/* GUEST SPEAKER CARD & INFORMATION SECTION */}
      <section id="details-section" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left column - Highlights & Info */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0B1533] flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-[#8B5CF6]" />
              About the Session
            </h2>
            <div className="h-1.5 w-24 bg-[#5B2C9E] rounded-full mt-3"></div>
          </div>

          <p className="text-base text-[#1A1A1A] leading-relaxed">
            Quantum mechanics is driving the next major technological leap. From powerful computing paradigms
            to next-generation encryption keys that cannot be cracked, understanding the quantum future is
            essential for computer scientists, physicists, mathematicians, and security enthusiasts.
          </p>

          <p className="text-base text-[#1A1A1A] leading-relaxed">
            Organised proudly by the <strong>School of Humanities and Sciences at IAR University</strong>, this expert interaction provides a unique opportunity to connect directly with an industry leader. Learn about core quantum principles, modern post-quantum cryptography, and practical quantum careers.
          </p>

          {/* Topics Covered */}
          <div className="bg-[#EDEBF5] rounded-2xl p-6 border border-[#8B5CF6]/10 shadow-sm">
            <h3 className="font-bold text-lg text-[#0B1533] mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#8B5CF6]" />
              Topics Covered
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 rounded-full bg-[#4DD8FF]"></span>
                Quantum Computing Technologies
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                Cryptography & Cybersecurity
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 rounded-full bg-[#7B3FE4]"></span>
                Real-World Applications of Qubits
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 rounded-full bg-[#5B2C9E]"></span>
                Career Paths in Quantum Tech
              </li>
            </ul>
          </div>

          {/* Target Audience */}
          <div className="flex items-center gap-4 bg-white border border-[#EDEBF5] p-5 rounded-xl shadow-sm">
            <Users className="w-8 h-8 text-[#8B5CF6] shrink-0" />
            <div>
              <h4 className="font-bold text-[#0B1533] text-sm">Who can Attend?</h4>
              <p className="text-xs text-gray-600 mt-1">
                Open to all students, faculties, researchers, entrepreneurs, innovators, and anyone interested in quantum mechanics and high-tech security.
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Elegant Speaker profile Card */}
        <div className="lg:col-span-5 bg-[#EDEBF5]/80 rounded-2xl p-8 border border-[#EDEBF5] shadow-md relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DD8FF]/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="text-center">
            {/* Elegant avatar mock with initials inside bright circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#5B2C9E] to-[#8B5CF6] flex items-center justify-center mx-auto shadow-md mb-4 border-4 border-white">
              <span className="text-3xl font-black text-white tracking-widest">AT</span>
            </div>

            <p className="text-[#8B5CF6] text-xs font-extrabold tracking-widest uppercase mb-1">Distinguished Speaker</p>
            <h3 className="text-2xl font-black text-[#0B1533]">Mr. Atul Tripathi</h3>
            <p className="text-sm font-bold text-gray-700 mt-1">
              Director – Quantum and Space Technology, PwC
            </p>

            <div className="h-px bg-gray-300 my-6"></div>

            <p className="text-xs text-gray-600 leading-relaxed text-left">
              Mr. Atul Tripathi is an acclaimed pioneer heading the Quantum and Space practice at PricewaterhouseCoopers (PwC). With extensive leadership experience globally, he is helping shape public and private sector policies on next-generation computing and cyber defenses.
            </p>

            <div className="bg-white/60 rounded-xl p-4 mt-6 text-left border border-white/80">
              <p className="text-xs font-bold text-[#0B1533] mb-2 flex items-center gap-1">
                <Coffee className="w-4 h-4 text-[#8B5CF6]" />
                Interactive Networking Opportunity
              </p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Enjoy hot tea, delicious refreshments, and interactive one-on-one sessions directly with Mr. Atul Tripathi on campus. Bring your questions and research proposals!
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* SEPARATOR */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#EDEBF5] to-transparent my-4"></div>

      {/* REGISTRATION FORM SECTION WITH DEEP NAVY AND ACCENT TONES */}
      <section id="register-section" className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-[#EDEBF5]/40 relative">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#EDEBF5] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">

          {/* Form Info Panel */}
          <div className="md:col-span-5 bg-[#0B1533] text-white p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#4DD8FF]/10 rounded-full blur-xl"></div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
                Secure Your <br />Expert Talk Seat
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Registrations are strictly limited due to auditorium and networking tea capacity. Please complete this secure form with your accurate details.
              </p>

              <div className="space-y-4 pt-4 text-xs">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#4DD8FF]" />
                  <span>Encrypted & fully audited inputs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#8B5CF6]" />
                  <span>No storage of raw plaintext sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-[#4DD8FF]" />
                  <span>Registration/Seat done instantly!</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-gray-400">
              <p>Organised by: School of Humanities & Sciences, IAR University</p>
              <p className="mt-1">© 2026 All Rights Reserved</p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="md:col-span-7 p-8 md:p-10">
            <h4 className="text-xl font-bold text-[#0B1533] mb-6">Attendee Registration Form</h4>

            {status.type && (
              <div className={`p-4 rounded-xl text-xs font-semibold mb-6 border ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0B1533] tracking-wide mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-[#EDEBF5]/50 border border-[#EDEBF5] focus:border-[#8B5CF6] text-sm rounded-xl py-3 px-4 focus:outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0B1533] tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="yourname@domain.com"
                  className="w-full bg-[#EDEBF5]/50 border border-[#EDEBF5] focus:border-[#8B5CF6] text-sm rounded-xl py-3 px-4 focus:outline-none transition font-medium"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0B1533] tracking-wide mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 98765 43210 or (555) 019-2834"
                  className="w-full bg-[#EDEBF5]/50 border border-[#EDEBF5] focus:border-[#8B5CF6] text-sm rounded-xl py-3 px-4 focus:outline-none transition font-medium"
                />
              </div>

              {/* School/College/University */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0B1533] tracking-wide mb-1.5">
                  Institution / School / University
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="institution"
                    required
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="e.g. IAR University, School of SHS"
                    className="w-full bg-[#EDEBF5]/50 border border-[#EDEBF5] focus:border-[#8B5CF6] text-sm rounded-xl py-3 px-4 focus:outline-none transition font-medium"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#0B1533] tracking-wide mb-1.5">
                  Are you a Student, Professor/Teacher?
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-[#EDEBF5]/50 border border-[#EDEBF5] focus:border-[#8B5CF6] text-sm rounded-xl py-3.5 px-4 focus:outline-none transition font-medium"
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor/Teacher</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5B2C9E] hover:bg-[#7B3FE4] text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg shadow-[#5B2C9E]/10 disabled:opacity-50 text-sm flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Processing Securely...' : 'Registered'}
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* SPONSOR SECTION */}
      <section className="py-12 bg-white text-center border-t border-[#EDEBF5] px-4">
        <h5 className="text-[11px] font-extrabold uppercase text-gray-500 tracking-widest mb-6">Organisers & Sponsors</h5>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75">
          <span className="text-base font-black text-[#0B1533]">IAR UNIVERSITY</span>
          <span className="text-sm font-semibold text-[#5B2C9E]">SCHOOL OF HUMANITIES AND SCIENCES</span>
          <span className="text-sm font-bold text-gray-700">QUANTUM TECHNOLOGY DEPT.</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1533] text-white py-12 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-300">
          <div>
            <h5 className="font-extrabold text-white text-base mb-4 tracking-wide uppercase">Event Information</h5>
            <p className="text-xs leading-relaxed">
              Explore the quantum landscape, cryptographic secure systems, and future career directions at this high-profile event by Mr. Atul Tripathi (PwC). Organized proudly with student support.
            </p>
          </div>
          <div>
            <h5 className="font-extrabold text-white text-base mb-4 tracking-wide uppercase">Venue & Directions</h5>
            <p className="text-xs leading-relaxed">
              IAR University Campus, Gyan Marg, Near GIFT City Bridge, Gandhinagar - 382426, Gujarat, India.
            </p>
            <p className="text-xs mt-2">
              Auditorium Hall, Auditorium A3Block.
            </p>
          </div>
          <div>
            <h5 className="font-extrabold text-white text-base mb-4 tracking-wide uppercase">Support & Contact</h5>
            <p className="text-xs leading-relaxed">
              If you have any issues registering or would like to partner, please email the department at <span className="text-[#4DD8FF]">head.shs@iar.ac.in</span>.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto h-px bg-white/10 my-8"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <p>© 2026 IAR University. All Rights Reserved.</p>
          </div>
          <div className="text-center md:text-right font-semibold">
            <p className="text-[#4DD8FF] text-xs">
              Made with ❤️ by the Students of Quantum Technology.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
