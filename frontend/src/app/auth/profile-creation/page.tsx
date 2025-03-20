'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const avatarOptions = [
  'lion-cub',
  'elephant-calf',
  'giraffe-calf',
  'zebra-calf',
  'rhino-calf',
  'hippo-calf',
];

export default function ProfileCreationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('lion-cub');
  const [age, setAge] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add validation and API call
    router.push('/auth/reading-assessment');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Create Your Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            What's your name?
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            How old are you?
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your age"
            min="2"
            max="12"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose your avatar
          </label>
          <div className="grid grid-cols-3 gap-4">
            {avatarOptions.map((avatar) => (
              <div
                key={avatar}
                className={`cursor-pointer rounded-lg p-2 transition-all ${
                  selectedAvatar === avatar
                    ? 'bg-green-100 ring-2 ring-green-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <Image
                  src={`/images/avatars/${avatar}.png`}
                  alt={avatar}
                  width={80}
                  height={80}
                  className="mx-auto rounded-full"
                />
                <p className="text-center text-sm mt-1 capitalize">
                  {avatar.replace('-', ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-800 transition-colors mt-8"
        >
          Continue to Reading Assessment
        </button>
      </form>
    </motion.div>
  );
} 