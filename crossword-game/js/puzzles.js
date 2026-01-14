// ===================================
// Puzzle Data and Generation
// ===================================

const Puzzles = {
    // Puzzle categories with words and clues
    categories: {
        animals: {
            name: 'Animals',
            icon: '🦁',
            words: [
                { word: 'CAT', clue: 'Furry pet that says meow', fact: 'Cats sleep 12-16 hours a day!' },
                { word: 'DOG', clue: 'Best friend that barks', fact: 'Dogs have an amazing sense of smell!' },
                { word: 'LION', clue: 'King of the jungle', fact: 'Lions live in groups called prides!' },
                { word: 'BEAR', clue: 'Big animal that loves honey', fact: 'Bears can run up to 30 mph!' },
                { word: 'TIGER', clue: 'Big cat with stripes', fact: 'Each tiger has unique stripes!' },
                { word: 'ELEPHANT', clue: 'Largest land animal', fact: 'Elephants never forget!' },
                { word: 'GIRAFFE', clue: 'Tallest animal with long neck', fact: 'Giraffes have the same number of neck bones as humans!' },
                { word: 'ZEBRA', clue: 'Horse with black and white stripes', fact: 'No two zebras have the same stripe pattern!' },
                { word: 'MONKEY', clue: 'Swings from trees', fact: 'Monkeys can peel bananas!' },
                { word: 'RABBIT', clue: 'Hops and has long ears', fact: 'Rabbits can jump 3 feet high!' }
            ]
        },
        fruits: {
            name: 'Fruits',
            icon: '🍎',
            words: [
                { word: 'APPLE', clue: 'Red or green fruit, keeps doctor away', fact: 'Apples float because they are 25% air!' },
                { word: 'BANANA', clue: 'Yellow fruit that monkeys love', fact: 'Bananas are berries, but strawberries are not!' },
                { word: 'ORANGE', clue: 'Citrus fruit with vitamin C', fact: 'Oranges are a hybrid fruit!' },
                { word: 'GRAPE', clue: 'Small round fruit, grows in bunches', fact: 'Grapes explode in the microwave!' },
                { word: 'MANGO', clue: 'Sweet tropical fruit', fact: 'Mangoes are related to cashews!' },
                { word: 'CHERRY', clue: 'Small red fruit with a pit', fact: 'Cherries are a member of the rose family!' },
                { word: 'PEACH', clue: 'Fuzzy fruit with a pit', fact: 'Peaches are native to China!' },
                { word: 'LEMON', clue: 'Sour yellow citrus', fact: 'Lemons have more sugar than strawberries!' },
                { word: 'MELON', clue: 'Large sweet fruit', fact: 'Watermelons are 92% water!' },
                { word: 'BERRY', clue: 'Small sweet fruit', fact: 'Strawberries have seeds on the outside!' }
            ]
        },
        countries: {
            name: 'Countries',
            icon: '🌍',
            words: [
                { word: 'CHINA', clue: 'Most populated country', fact: 'China has the longest wall in the world!' },
                { word: 'INDIA', clue: 'Country famous for curry', fact: 'India has 22 official languages!' },
                { word: 'JAPAN', clue: 'Land of the rising sun', fact: 'Japan has over 6,800 islands!' },
                { word: 'FRANCE', clue: 'Country of the Eiffel Tower', fact: 'France is the most visited country!' },
                { word: 'BRAZIL', clue: 'Largest country in South America', fact: 'Brazil has the Amazon rainforest!' },
                { word: 'EGYPT', clue: 'Country with pyramids', fact: 'Egypt is home to the Nile River!' },
                { word: 'CANADA', clue: 'Second largest country', fact: 'Canada has more lakes than the rest of the world!' },
                { word: 'ITALY', clue: 'Country shaped like a boot', fact: 'Italy has more UNESCO sites than any other country!' },
                { word: 'SPAIN', clue: 'Country famous for flamenco', fact: 'Spain has 44 UNESCO World Heritage Sites!' },
                { word: 'GREECE', clue: 'Birthplace of democracy', fact: 'Greece has over 6,000 islands!' }
            ]
        },
        space: {
            name: 'Space',
            icon: '🚀',
            words: [
                { word: 'SUN', clue: 'Star at center of solar system', fact: 'The Sun is 4.6 billion years old!' },
                { word: 'MOON', clue: 'Earth\'s natural satellite', fact: 'The Moon is moving away from Earth!' },
                { word: 'MARS', clue: 'The red planet', fact: 'Mars has the largest volcano in the solar system!' },
                { word: 'EARTH', clue: 'Our home planet', fact: 'Earth is the only planet not named after a god!' },
                { word: 'STAR', clue: 'Bright object in night sky', fact: 'There are more stars than grains of sand!' },
                { word: 'COMET', clue: 'Icy object with a tail', fact: 'Comets are leftovers from the solar system formation!' },
                { word: 'PLANET', clue: 'Large object orbiting a star', fact: 'There are 8 planets in our solar system!' },
                { word: 'ROCKET', clue: 'Vehicle for space travel', fact: 'Rockets need to go 17,500 mph to orbit Earth!' },
                { word: 'GALAXY', clue: 'System of billions of stars', fact: 'Our galaxy has 200-400 billion stars!' },
                { word: 'SATURN', clue: 'Planet with beautiful rings', fact: 'Saturn\'s rings are made of ice and rock!' }
            ]
        },
        sports: {
            name: 'Sports',
            icon: '⚽',
            words: [
                { word: 'SOCCER', clue: 'Sport with goals and a ball', fact: 'Soccer is the most popular sport in the world!' },
                { word: 'TENNIS', clue: 'Sport with rackets and a net', fact: 'Tennis balls are yellow for better visibility!' },
                { word: 'HOCKEY', clue: 'Sport played on ice', fact: 'Hockey pucks can reach 100 mph!' },
                { word: 'GOLF', clue: 'Sport with clubs and holes', fact: 'Golf balls have dimples to fly farther!' },
                { word: 'BOXING', clue: 'Fighting sport with gloves', fact: 'Boxing is one of the oldest sports!' },
                { word: 'RUGBY', clue: 'Sport similar to football', fact: 'Rugby was invented in England!' },
                { word: 'CRICKET', clue: 'Bat and ball sport', fact: 'Cricket matches can last 5 days!' },
                { word: 'SWIMMING', clue: 'Sport in water', fact: 'Swimming works every muscle in your body!' },
                { word: 'RUNNING', clue: 'Moving fast on foot', fact: 'Running improves heart health!' },
                { word: 'CYCLING', clue: 'Sport on two wheels', fact: 'Cycling is eco-friendly transportation!' }
            ]
        }
    },

    // Generate puzzle based on difficulty
    generatePuzzle(difficulty, category = null) {
        const gridSizes = {
            easy: 5,
            medium: 8,
            hard: 12
        };

        const wordCounts = {
            easy: 4,
            medium: 7,
            hard: 12
        };

        const size = gridSizes[difficulty] || 5;
        const wordCount = wordCounts[difficulty] || 4;
        
        // Select category
        const categoryKeys = Object.keys(this.categories);
        const selectedCategory = category || categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const categoryData = this.categories[selectedCategory];

        // Select words based on difficulty
        const availableWords = [...categoryData.words];
        const selectedWords = [];

        // For easy, use shorter words
        if (difficulty === 'easy') {
            availableWords.sort((a, b) => a.word.length - b.word.length);
        }

        // Select random words
        for (let i = 0; i < Math.min(wordCount, availableWords.length); i++) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            selectedWords.push(availableWords.splice(randomIndex, 1)[0]);
        }

        return {
            size,
            category: selectedCategory,
            categoryName: categoryData.name,
            categoryIcon: categoryData.icon,
            words: selectedWords,
            difficulty
        };
    },

    // Pre-defined puzzles for specific levels
    getLevelPuzzle(levelNumber) {
        const difficulties = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];
        const categories = ['animals', 'fruits', 'countries', 'space', 'sports'];
        
        const difficulty = difficulties[(levelNumber - 1) % difficulties.length] || 'easy';
        const category = categories[(levelNumber - 1) % categories.length];
        
        return this.generatePuzzle(difficulty, category);
    },

    // Generate daily puzzle with date-based seed
    getDailyPuzzle() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        
        // Use day of year to select category and difficulty
        const categories = Object.keys(this.categories);
        const difficulties = ['easy', 'medium', 'hard'];
        
        const categoryIndex = dayOfYear % categories.length;
        const difficultyIndex = dayOfYear % difficulties.length;
        
        return this.generatePuzzle(difficulties[difficultyIndex], categories[categoryIndex]);
    },

    // Place words on grid (simplified algorithm)
    placeWordsOnGrid(puzzle) {
        const { size, words } = puzzle;
        const grid = Array(size).fill(null).map(() => Array(size).fill(null));
        const placedWords = [];

        // Try to place each word
        words.forEach((wordData, index) => {
            const word = wordData.word;
            const isHorizontal = Math.random() > 0.5;
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 50) {
                attempts++;
                
                if (isHorizontal) {
                    const row = Math.floor(Math.random() * size);
                    const col = Math.floor(Math.random() * (size - word.length + 1));
                    
                    // Check if space is available
                    let canPlace = true;
                    for (let i = 0; i < word.length; i++) {
                        if (grid[row][col + i] !== null && grid[row][col + i] !== word[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    
                    if (canPlace) {
                        // Place word
                        for (let i = 0; i < word.length; i++) {
                            grid[row][col + i] = word[i];
                        }
                        placedWords.push({
                            ...wordData,
                            number: index + 1,
                            row,
                            col,
                            direction: 'across',
                            length: word.length
                        });
                        placed = true;
                    }
                } else {
                    const row = Math.floor(Math.random() * (size - word.length + 1));
                    const col = Math.floor(Math.random() * size);
                    
                    // Check if space is available
                    let canPlace = true;
                    for (let i = 0; i < word.length; i++) {
                        if (grid[row + i][col] !== null && grid[row + i][col] !== word[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    
                    if (canPlace) {
                        // Place word
                        for (let i = 0; i < word.length; i++) {
                            grid[row + i][col] = word[i];
                        }
                        placedWords.push({
                            ...wordData,
                            number: index + 1,
                            row,
                            col,
                            direction: 'down',
                            length: word.length
                        });
                        placed = true;
                    }
                }
            }
        });

        return {
            grid,
            words: placedWords
        };
    }
};
