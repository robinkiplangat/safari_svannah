import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    AcademicCapIcon,
    StarIcon,
    TrophyIcon,
    ClockIcon,
    LightningBoltIcon
} from '@heroicons/react/solid';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    total_required: number;
}

interface SkillProgress {
    skill_name: string;
    current_level: number;
    progress_to_next: number;
    total_required: number;
    recent_activities: {
        date: string;
        activity_type: string;
        score: number;
    }[];
}

interface LearningPath {
    current_stage: string;
    completed_stages: string[];
    next_stages: string[];
    recommended_activities: {
        type: string;
        difficulty: string;
        reason: string;
    }[];
}

interface ProgressTrackerProps {
    userId: string;
    onActivitySelect: (activityType: string, difficulty: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    userId,
    onActivitySelect
}) => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'achievements'>('overview');

    useEffect(() => {
        fetchUserProgress();
    }, [userId]);

    const fetchUserProgress = async () => {
        try {
            const [achievementsRes, skillsRes, pathRes] = await Promise.all([
                fetch(`/api/progress/${userId}/achievements`),
                fetch(`/api/progress/${userId}/skills`),
                fetch(`/api/progress/${userId}/learning-path`)
            ]);

            const [achievementsData, skillsData, pathData] = await Promise.all([
                achievementsRes.json(),
                skillsRes.json(),
                pathRes.json()
            ]);

            setAchievements(achievementsData.achievements);
            setSkillProgress(skillsData.skills);
            setLearningPath(pathData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching progress data:', error);
            setLoading(false);
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Current Learning Journey</h3>
                {learningPath && (
                    <>
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{
                                        width: `${(learningPath.completed_stages.length /
                                            (learningPath.completed_stages.length +
                                                learningPath.next_stages.length)) *
                                            100}%`
                                    }}
                                />
                            </div>
                            <span className="text-sm text-gray-600">
                                Stage {learningPath.completed_stages.length + 1}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-medium">Recommended Activities:</h4>
                            {learningPath.recommended_activities.map((activity, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() =>
                                        onActivitySelect(activity.type, activity.difficulty)
                                    }
                                    className="w-full p-3 bg-blue-50 rounded-lg flex items-center justify-between hover:bg-blue-100"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {activity.type.replace('_', ' ')}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {activity.reason}
                                        </div>
                                    </div>
                                    <LightningBoltIcon className="h-5 w-5 text-blue-500" />
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
                    <div className="space-y-4">
                        {achievements
                            .filter(a => a.unlocked)
                            .slice(0, 3)
                            .map(achievement => (
                                <div
                                    key={achievement.id}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="text-3xl">{achievement.icon}</div>
                                    <div>
                                        <div className="font-medium">
                                            {achievement.title}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {achievement.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Top Skills</h3>
                    <div className="space-y-4">
                        {skillProgress.slice(0, 3).map(skill => (
                            <div key={skill.skill_name}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">
                                        {skill.skill_name.replace('_', ' ')}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Level {skill.current_level}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{
                                            width: `${(skill.progress_to_next /
                                                skill.total_required) *
                                                100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-6">
            {skillProgress.map(skill => (
                <div key={skill.skill_name} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            {skill.skill_name.replace('_', ' ')}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <AcademicCapIcon className="h-5 w-5 text-blue-500" />
                            <span>Level {skill.current_level}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">
                                Progress to Level {skill.current_level + 1}
                            </span>
                            <span className="text-sm text-gray-600">
                                {skill.progress_to_next}/{skill.total_required}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                    width: `${(skill.progress_to_next / skill.total_required) *
                                        100}%`
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Recent Activities</h4>
                        <div className="space-y-2">
                            {skill.recent_activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center text-sm"
                                >
                                    <div className="flex items-center space-x-2">
                                        <ClockIcon className="h-4 w-4 text-gray-400" />
                                        <span>{activity.activity_type.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <StarIcon className="h-4 w-4 text-yellow-500" />
                                        <span>{activity.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderAchievements = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
                <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white p-6 rounded-lg shadow-md ${
                        !achievement.unlocked ? 'opacity-50' : ''
                    }`}
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-gray-600">
                                {achievement.description}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm text-gray-600">
                                {achievement.progress}/{achievement.total_required}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{
                                    width: `${(achievement.progress /
                                        achievement.total_required) *
                                        100}%`
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        activeTab === 'overview'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    <ChartBarIcon className="h-5 w-5" />
                    <span>Overview</span>
                </button>
                <button
                    onClick={() => setActiveTab('skills')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        activeTab === 'skills'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    <AcademicCapIcon className="h-5 w-5" />
                    <span>Skills</span>
                </button>
                <button
                    onClick={() => setActiveTab('achievements')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        activeTab === 'achievements'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    <TrophyIcon className="h-5 w-5" />
                    <span>Achievements</span>
                </button>
            </div>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'skills' && renderSkills()}
            {activeTab === 'achievements' && renderAchievements()}
        </div>
    );
}; 