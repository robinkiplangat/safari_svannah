'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  name?: string;
  avatar?: string;
  readingLevel?: number;
}

const DashboardPage = () => {
  const router = useRouter();

  const dailyProgress = {
    minutesRead: 25,
    wordsLearned: 12,
    storiesCompleted: 2,
    dailyGoal: 30
  };

  const recentAnimals = [
    { id: 1, name: 'Lion', image: '/images/animals/lion.png' },
    { id: 2, name: 'Elephant', image: '/images/animals/elephant.png' },
    { id: 3, name: 'Giraffe', image: '/images/animals/giraffe.png' },
  ];

  const dailyChallenge = {
    title: "Savannah Explorer",
    description: "Read 2 stories about African wildlife",
    reward: "50 XP",
    progress: 1,
    total: 2
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#FFB75E] to-[#ED8F03] p-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
            <Image
              src="/images/avatars/default.png"
              alt="User Avatar"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, User!</h1>
            <p className="text-white opacity-90">Reading Level 3</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Daily Progress */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Progress</h2>
          <div className="bg-gray-50 p-4 rounded-xl flex items-center">
            <div className="w-20 h-20 rounded-full bg-green-700 flex flex-col items-center justify-center text-white mr-4">
              <span className="text-2xl font-bold">{dailyProgress.minutesRead}</span>
              <span className="text-sm">minutes</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-600">🎯 {dailyProgress.wordsLearned} new words</p>
              <p className="text-gray-600">📚 {dailyProgress.storiesCompleted} stories</p>
              <div className="h-2 bg-green-100 rounded mt-2">
                <div 
                  className="h-full bg-green-700 rounded"
                  style={{ width: `${(dailyProgress.minutesRead / dailyProgress.dailyGoal) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">Daily Goal: {dailyProgress.dailyGoal} minutes</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Continue Learning</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/stories')}
              className="flex-1 bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800 transition-colors"
            >
              Start Reading
            </button>
            <button 
              onClick={() => router.push('/wildlife')}
              className="flex-1 border-2 border-green-700 text-green-700 py-3 px-6 rounded-lg hover:bg-green-50 transition-colors"
            >
              Explore Animals
            </button>
          </div>
        </section>

        {/* Recent Discoveries */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Discoveries</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentAnimals.map(animal => (
              <div 
                key={animal.id}
                className="flex-none w-40 cursor-pointer"
                onClick={() => router.push(`/wildlife/${animal.id}`)}
              >
                <div className="w-40 h-40 rounded-lg overflow-hidden mb-2">
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <p className="text-center font-medium">{animal.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Challenge */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Challenge</h2>
          <div 
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push('/challenges')}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-lg">{dailyChallenge.title}</h3>
                <p className="text-gray-600">{dailyChallenge.description}</p>
                <p className="text-green-700 font-medium">Reward: {dailyChallenge.reward}</p>
              </div>
              <div className="text-lg font-semibold">
                {dailyChallenge.progress}/{dailyChallenge.total}
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded">
              <div 
                className="h-full bg-green-700 rounded"
                style={{ width: `${(dailyChallenge.progress / dailyChallenge.total) * 100}%` }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage; 