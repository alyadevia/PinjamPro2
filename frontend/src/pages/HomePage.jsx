// File: frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; // <-- Impor Header

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <div className="border-b py-4">
      <details className="group">
        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
          <span>{question}</span>
          <span className="text-primary group-open:rotate-180 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </summary>
        <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
          {answer}
        </p>
      </details>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Next-gen Borrowing,
              <br />
              <span className="text-primary">Built for Campus.</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              PinjamPro hadir untuk mempermudah proses peminjaman barang di lingkungan kampus.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-block bg-primary text-white font-bold px-6 py-3 rounded-md hover:bg-primary-light transition-colors"
            >
              Get Started →
            </Link>
          </div>
          
          {/* --- PERBAIKAN TAMPILAN DI SINI --- */}
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-10">
            {/* Ganti 'hero-image.png' dengan nama file gambar Anda */}
            <img 
              src="/revisi22.png" 
              alt="Peminjaman Barang Kampus" 
              className="rounded-lg shadow-xl w-full h-auto object-cover" 
            />
          </div>
          {/* ---------------------------------- */}

        </div>
      </section>

      {/* Features Section */}
      <section id="info" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Kenapa Harus PinjamPro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard title="Mudah & Cepat" description="Ajukan peminjaman barang hanya dengan beberapa klik." />
            <FeatureCard title="Notifikasi Otomatis" description="Dapatkan notifikasi instan saat peminjaman disetujui." />
            <FeatureCard title="Inventaris Lengkap" description="Cari barang sesuai kategori - dari peralatan kelas hingga acara." />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <FaqItem question="Apa itu PinjamPro?" answer="PinjamPro adalah sistem untuk mempermudah peminjaman barang di kampus." />
          <FaqItem question="Bagaimana cara meminjam barang?" answer="Login, cari barang di dashboard, lalu klik 'Ajukan Peminjaman' dan isi form-nya." />
          <FaqItem question="Apakah saya bisa mengecek status peminjaman?" answer="Tentu! Anda bisa memantau status di halaman 'My Borrowings'." />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p>© 2025 PinjamPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}