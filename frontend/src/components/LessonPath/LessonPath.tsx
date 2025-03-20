import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, LockOpenIcon, CheckCircleIcon } from '@heroicons/react/solid';

interface Lesson {
    id: string;
    title: string;
    theme: string;
    difficulty: string;
    isLocked: boolean;
    isCompleted: boolean;
    requiredProgress: number;
    icon: string;
}

interface LessonPathProps {
    userId: string;
    onSelectLesson: (lesson: Lesson) => void;
}

export const LessonPath: React.FC<LessonPathProps> = ({ userId, onSelectLesson }) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [userProgress, setUserProgress] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLessons();
        fetchUserProgress();
    }, [userId]);

    const fetchLessons = async () => {
        try {
            const response = await fetch('/api/stories/themes');
            const data = await response.json();
            
            // Transform themes into lessons
            const transformedLessons = data.themes.map((theme: string, index: number) => ({
                id: `lesson-${index + 1}`,
                title: `${theme} Adventure`,
                theme,
                difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
                isLocked: index > 0,  // First lesson is unlocked
                isCompleted: false,
                requiredProgress: index * 10,
                icon: getThemeIcon(theme)
            }));

            setLessons(transformedLessons);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching lessons:', error);
            setLoading(false);
        }
    };

    const fetchUserProgress = async () => {
        try {
            const response = await fetch(`/api/progress/user/${userId}`);
            const data = await response.json();
            setUserProgress(data.activities_completed || 0);
            
            // Update lesson completion status
            setLessons(prevLessons => 
                prevLessons.map(lesson => ({
                    ...lesson,
                    isLocked: lesson.requiredProgress > data.activities_completed,
                    isCompleted: lesson.requiredProgress <= data.activities_completed
                }))
            );
        } catch (error) {
            console.error('Error fetching user progress:', error);
        }
    };

    const getThemeIcon = (theme: string): string => {
        const icons: { [key: string]: string } = {
            'Courage': '🦁',
            'Friendship': '🤝',
            'Sharing': '🎁',
            'Patience': '🐢',
            'Kindness': '💝',
            'Perseverance': '🏃',
            'Honesty': '✨',
            'Responsibility': '📚'
        };
        return icons[theme] || '📖';
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                                relative flex items-center p-4 rounded-lg shadow-md
                                ${lesson.isLocked 
                                    ? 'bg-gray-100 cursor-not-allowed' 
                                    : lesson.isCompleted
                                        ? 'bg-green-50 cursor-pointer'
                                        : 'bg-white cursor-pointer hover:bg-blue-50'
                                }
                            `}
                            onClick={() => !lesson.isLocked && onSelectLesson(lesson)}
                        >
                            <div className="flex-shrink-0 text-3xl mr-4">
                                {lesson.icon}
                            </div>
                            
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                                <p className="text-sm text-gray-600">
                                    Difficulty: <span className="capitalize">{lesson.difficulty}</span>
                                </p>
                                {lesson.isLocked && (
                                    <p className="text-sm text-gray-500">
                                        Complete {lesson.requiredProgress} activities to unlock
                                    </p>
                                )}
                            </div>

                            <div className="flex-shrink-0 ml-4">
                                {lesson.isCompleted ? (
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                ) : lesson.isLocked ? (
                                    <LockClosedIcon className="h-6 w-6 text-gray-400" />
                                ) : (
                                    <LockOpenIcon className="h-6 w-6 text-blue-500" />
                                )}
                            </div>

                            {index < lessons.length - 1 && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0.5 h-4 bg-gray-300" />
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}; 