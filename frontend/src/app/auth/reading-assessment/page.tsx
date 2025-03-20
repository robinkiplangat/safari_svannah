'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const sampleTexts = [
  {
    level: 1,
    text: "The big lion walks. He sees a zebra. The zebra runs fast.",
    questions: [
      {
        question: "What animal does the lion see?",
        options: ["A zebra", "An elephant", "A giraffe"],
        correct: 0
      }
    ]
  },
  {
    level: 2,
    text: "The elephant family lives in the savannah. They drink water at the lake every day. Baby elephants play in the mud.",
    questions: [
      {
        question: "Where do the elephants drink water?",
        options: ["At the river", "At the lake", "In the mud"],
        correct: 1
      }
    ]
  }
];

export default function ReadingAssessmentPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleContinue = () => {
    if (!showQuestion) {
      setShowQuestion(true);
      return;
    }

    if (currentLevel < sampleTexts.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setShowQuestion(false);
      setSelectedAnswer(null);
    } else {
      // Assessment complete, navigate to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Reading Assessment
        </h1>
        <p className="text-gray-600">
          Let's find the perfect reading level for you!
        </p>
      </div>

      {!showQuestion ? (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-lg leading-relaxed text-gray-800">
              {sampleTexts[currentLevel].text}
            </p>
          </div>
          <button
            onClick={handleContinue}
            className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 transition-colors"
          >
            I've finished reading
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-lg font-medium text-gray-800">
            {sampleTexts[currentLevel].questions[0].question}
          </p>
          <div className="space-y-3">
            {sampleTexts[currentLevel].questions[0].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  selectedAnswer === index
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedAnswer === null}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              selectedAnswer !== null
                ? 'bg-green-700 text-white hover:bg-green-800'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentLevel === sampleTexts.length - 1 ? 'Complete Assessment' : 'Continue'}
          </button>
        </div>
      )}

      <div className="flex justify-center space-x-2 mt-8">
        {sampleTexts.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentLevel ? 'bg-green-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
} 