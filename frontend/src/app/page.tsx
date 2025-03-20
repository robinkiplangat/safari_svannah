'use client';

import Image from 'next/image';
import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-400">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold text-white mb-2">Svannah</h1>
          <h2 className="text-3xl font-semibold text-brown-800">Explore. Learn. Roam.</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1"
          >
            <Image
              src="/images/hero.png"
              alt="Svannah Learning Adventure"
              width={600}
              height={600}
              className="rounded-lg shadow-2xl"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Welcome to the Adventure</h3>
            <p className="text-gray-600 mb-8">Join us on an exciting journey through the savanna</p>
            
            <div className="space-y-4">
              <SignIn 
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600',
                    card: 'bg-transparent shadow-none',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
