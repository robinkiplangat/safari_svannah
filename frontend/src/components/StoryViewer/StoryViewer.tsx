import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, VolumeUpIcon } from '@heroicons/react/solid';

interface Scene {
    scene_number: number;
    description: string;
    dialogue: string;
    moral_lesson: string;
    visual_elements: string[];
}

interface Story {
    title: string;
    animal_character: string;
    scenes: Scene[];
    moral_summary: string;
    parent_tips: string[];
}

interface StoryViewerProps {
    storyId: string;
    onComplete: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ storyId, onComplete }) => {
    const [story, setStory] = useState<Story | null>(null);
    const [currentScene, setCurrentScene] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        fetchStory();
    }, [storyId]);

    const fetchStory = async () => {
        try {
            const response = await fetch(`/api/stories/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    story_id: storyId,
                }),
            });
            const data = await response.json();
            setStory(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching story:', error);
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (story && currentScene < story.scenes.length - 1) {
            setCurrentScene(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentScene > 0) {
            setCurrentScene(prev => prev - 1);
        }
    };

    const readScene = () => {
        if (story && !isReading) {
            setIsReading(true);
            const utterance = new SpeechSynthesisUtterance(
                story.scenes[currentScene].dialogue
            );
            utterance.onend = () => setIsReading(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="text-center text-red-500">
                Error loading story
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">{story.title}</h1>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentScene}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                >
                    <div className="aspect-w-16 aspect-h-9 mb-6 bg-gray-200 rounded-lg">
                        {/* This would be replaced with actual scene illustration */}
                        <div className="flex items-center justify-center text-6xl">
                            {story.scenes[currentScene].visual_elements[0]}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-lg">{story.scenes[currentScene].dialogue}</p>
                        
                        <button
                            onClick={readScene}
                            disabled={isReading}
                            className={`
                                flex items-center space-x-2 px-4 py-2 rounded-full
                                ${isReading 
                                    ? 'bg-gray-200 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }
                            `}
                        >
                            <VolumeUpIcon className="h-5 w-5" />
                            <span>{isReading ? 'Reading...' : 'Read Aloud'}</span>
                        </button>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={handlePrevious}
                            disabled={currentScene === 0}
                            className={`
                                flex items-center space-x-2 px-4 py-2 rounded-full
                                ${currentScene === 0
                                    ? 'bg-gray-200 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }
                            `}
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                            <span>Previous</span>
                        </button>

                        <div className="text-gray-500">
                            {currentScene + 1} / {story.scenes.length}
                        </div>

                        <button
                            onClick={handleNext}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <span>{currentScene === story.scenes.length - 1 ? 'Finish' : 'Next'}</span>
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {currentScene === story.scenes.length - 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-green-50 rounded-lg"
                >
                    <h2 className="text-xl font-semibold mb-4">Story Moral</h2>
                    <p className="text-gray-700">{story.moral_summary}</p>

                    <h3 className="text-lg font-semibold mt-6 mb-2">Tips for Parents</h3>
                    <ul className="list-disc list-inside space-y-2">
                        {story.parent_tips.map((tip, index) => (
                            <li key={index} className="text-gray-700">{tip}</li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </div>
    );
}; 