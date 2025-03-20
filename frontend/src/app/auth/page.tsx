'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-8">
        <Image
          src="/images/safari-logo.png"
          alt="Safari Savannah Logo"
          width={160}
          height={160}
          className="mx-auto"
        />
      </div>
      
      <h1 className="text-4xl font-bold text-green-800 mb-3 drop-shadow-sm">
        Safari Savannah
      </h1>
      <p className="text-lg text-green-700 mb-10">
        Begin your wildlife reading adventure!
      </p>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/auth/profile-creation')}
          className="w-full bg-green-700 text-white py-4 px-6 rounded-full font-bold text-lg hover:bg-green-800 transition-colors shadow-md"
        >
          Start Adventure
        </button>

        <button
          onClick={() => router.push('/auth/parent-login')}
          className="w-full border-2 border-green-700 text-green-700 py-4 px-6 rounded-full font-bold text-lg hover:bg-green-50 transition-colors"
        >
          Parent Login
        </button>
      </div>

      <div className="mt-12 opacity-20">
        <Image
          src="/images/animals-silhouette.png"
          alt="Animals Silhouette"
          width={400}
          height={100}
          className="mx-auto"
        />
      </div>
    </motion.div>
  );
} 