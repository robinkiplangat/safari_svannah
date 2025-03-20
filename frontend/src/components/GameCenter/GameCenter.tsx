import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/solid';

interface PuzzleType {
    description: string;
    difficulties: string[];
    icon: string;
}

interface GameElement {
    element_type: string;
    content: any;
    correct_answer: any;
    hints: string[];
}

interface Game {
    puzzle_type: string;
    difficulty: string;
    title: string;
    description: string;
    elements: GameElement[];
    instructions: string;
    reward_message: string;
    learning_outcome: string;
}

interface GameCenterProps {
    userId: string;
    animalTheme: string;
    onGameComplete: (score: number) => void;
}

export const GameCenter: React.FC<GameCenterProps> = ({ userId, animalTheme, onGameComplete }) => {
    const [puzzleTypes, setPuzzleTypes] = useState<Record<string, PuzzleType>>({});
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
    const [currentGame, setCurrentGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
    const [showHint, setShowHint] = useState<number | null>(null);

    useEffect(() => {
        fetchPuzzleTypes();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameStarted) {
            timer = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameStarted]);

    const fetchPuzzleTypes = async () => {
        try {
            const response = await fetch('/api/games/types');
            const data = await response.json();
            setPuzzleTypes(data.puzzle_types);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching puzzle types:', error);
            setLoading(false);
        }
    };

    const startGame = async () => {
        try {
            const response = await fetch('/api/games/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    puzzle_type: selectedType,
                    difficulty: selectedDifficulty,
                    animal_theme: animalTheme,
                    lesson_theme: 'fun_learning'
                }),
            });
            const game = await response.json();
            setCurrentGame(game);
            setGameStarted(true);
            setScore(0);
            setTimeSpent(0);
            setSelectedAnswers({});
        } catch (error) {
            console.error('Error starting game:', error);
        }
    };

    const handleAnswer = (elementIndex: number, answer: any) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [elementIndex]: answer
        }));

        if (currentGame?.elements[elementIndex].correct_answer === answer) {
            setScore(prev => prev + 1);
        }

        // Check if all elements have been answered
        if (Object.keys(selectedAnswers).length === currentGame?.elements.length - 1) {
            finishGame();
        }
    };

    const finishGame = async () => {
        const finalScore = (score / (currentGame?.elements.length || 1)) * 100;
        
        try {
            await fetch('/api/games/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game_id: currentGame?.puzzle_type,
                    score: finalScore,
                    time_spent: timeSpent,
                    completed: true
                }),
            });

            onGameComplete(finalScore);
            setGameStarted(false);
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    const renderGameElement = (element: GameElement, index: number) => {
        switch (element.element_type) {
            case 'shape':
                return (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-white rounded-lg shadow-md"
                    >
                        <div className="text-6xl mb-4">{element.content}</div>
                        <div className="grid grid-cols-2 gap-2">
                            {element.hints.map((answer, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(index, answer)}
                                    className={`
                                        p-2 rounded-md
                                        ${selectedAnswers[index] === answer
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'counting':
                return (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-white rounded-lg shadow-md"
                    >
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {Array(element.content).fill('🔵').map((dot, i) => (
                                <div key={i} className="text-2xl">{dot}</div>
                            ))}
                        </div>
                        <input
                            type="number"
                            min="0"
                            max="20"
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => handleAnswer(index, parseInt(e.target.value))}
                        />
                    </motion.div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {!gameStarted ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Choose Your Game</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(puzzleTypes).map(([type, info]) => (
                            <motion.button
                                key={type}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedType(type)}
                                className={`
                                    p-4 rounded-lg shadow-md text-center
                                    ${selectedType === type
                                        ? 'bg-blue-100 border-2 border-blue-500'
                                        : 'bg-white hover:bg-gray-50'
                                    }
                                `}
                            >
                                <div className="text-4xl mb-2">{info.icon}</div>
                                <h3 className="font-semibold">{type.replace('_', ' ')}</h3>
                                <p className="text-sm text-gray-600">{info.description}</p>
                            </motion.button>
                        ))}
                    </div>

                    {selectedType && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-semibold">Select Difficulty</h3>
                            <div className="flex space-x-4">
                                {puzzleTypes[selectedType].difficulties.map(difficulty => (
                                    <button
                                        key={difficulty}
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                        className={`
                                            px-6 py-2 rounded-full
                                            ${selectedDifficulty === difficulty
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                            }
                                        `}
                                    >
                                        {difficulty}
                                    </button>
                                ))}
                            </div>

                            {selectedDifficulty && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={startGame}
                                    className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Start Game
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </div>
            ) : currentGame && (
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{currentGame.title}</h2>
                            <div className="flex space-x-4">
                                <div className="flex items-center">
                                    <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                    <span>{score}</span>
                                </div>
                                <div className="flex items-center">
                                    <ClockIcon className="h-5 w-5 text-gray-500 mr-1" />
                                    <span>{timeSpent}s</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600">{currentGame.instructions}</p>

                        <div className="grid gap-6">
                            {currentGame.elements.map((element, index) => (
                                <div key={index} className="relative">
                                    {renderGameElement(element, index)}
                                    
                                    {element.hints.length > 0 && (
                                        <button
                                            onClick={() => setShowHint(showHint === index ? null : index)}
                                            className="absolute top-2 right-2 text-blue-500 hover:text-blue-600"
                                        >
                                            <AcademicCapIcon className="h-6 w-6" />
                                        </button>
                                    )}
                                    
                                    {showHint === index && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-full mt-2 right-0 bg-white p-3 rounded-lg shadow-lg z-10"
                                        >
                                            <p className="text-sm text-gray-600">{element.hints[0]}</p>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}; 