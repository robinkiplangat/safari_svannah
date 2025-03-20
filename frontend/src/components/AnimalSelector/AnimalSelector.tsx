import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon } from '@heroicons/react/outline';

interface Animal {
    name: string;
    type: string;
    icon: string;
}

interface AnimalSelectorProps {
    onSelect: (animal: Animal) => void;
    selectedAnimal?: Animal;
}

export const AnimalSelector: React.FC<AnimalSelectorProps> = ({ onSelect, selectedAnimal }) => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        try {
            const response = await fetch('/api/stories/animals');
            const data = await response.json();
            setAnimals(data.animals);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching animals:', error);
            setLoading(false);
        }
    };

    const filteredAnimals = animals.filter(animal =>
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search animals..."
                        className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredAnimals.map((animal) => (
                        <motion.div
                            key={animal.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(animal)}
                            className={`
                                cursor-pointer p-4 rounded-lg shadow-md text-center
                                ${selectedAnimal?.name === animal.name
                                    ? 'bg-blue-100 border-2 border-blue-500'
                                    : 'bg-white hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="text-4xl mb-2">{animal.icon}</div>
                            <h3 className="text-lg font-semibold">{animal.name}</h3>
                            <p className="text-sm text-gray-600">{animal.type}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && filteredAnimals.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No animals found matching "{searchQuery}"
                </div>
            )}
        </div>
    );
}; 