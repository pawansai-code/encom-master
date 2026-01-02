import {
    FaBrain,
    FaChess,
    FaGamepad,
    FaGhost,
    FaKeyboard,
    FaQuestion,
    FaSquare,
    FaTerminal,
    FaUserSecret
} from 'react-icons/fa';

export const GAMES_CONFIG = [
    {
        id: 'code-breaker',
        name: 'Code Breaker',
        description: 'Decipher patterns and unlock levels.',
        icon: FaTerminal,
        path: '/funzone/code-breaker',
        category: 'Puzzle',
        accentColor: '#00FF00',
        difficulty: 'Medium'
    },
    {
        id: 'tic-tac-toe',
        name: 'Tic Tac Toe',
        description: 'Classic X and O strategy game against AI.',
        icon: FaGamepad,
        path: '/funzone/tic-tac-toe',
        category: 'Classic',
        accentColor: '#FF6B6B',
        difficulty: 'Easy'
    },
    {
        id: 'memory',
        name: 'Memory Master',
        description: 'Test your memory by matching card pairs.',
        icon: FaBrain,
        path: '/funzone/memory',
        category: 'Puzzle',
        accentColor: '#4ECDC4',
        difficulty: 'Medium'
    },
    {
        id: 'snake',
        name: 'Neon Snake',
        description: 'Navigate the snake to eat food and grow!',
        icon: FaGhost,
        path: '/funzone/snake',
        category: 'Arcade',
        accentColor: '#45B7D1',
        difficulty: 'Hard'
    },
    {
        id: 'trivia',
        name: 'Ninja Trivia',
        description: 'Test your knowledge across various topics.',
        icon: FaQuestion,
        path: '/funzone/trivia',
        category: 'Education',
        accentColor: '#A06CD5',
        difficulty: 'Medium'
    },
    {
        id: 'typing',
        name: 'Speed Typer',
        description: 'Race against time to type words correctly.',
        icon: FaKeyboard,
        path: '/funzone/typing',
        category: 'Skill',
        accentColor: '#FF9F1C',
        difficulty: 'Hard'
    },
    {
        id: 'chess-lite',
        name: 'Chess Lite',
        description: 'Simplified chess puzzles and challenges.',
        icon: FaChess,
        path: '/funzone/chess-lite',
        category: 'Strategy',
        accentColor: '#F7FFF7',
        difficulty: 'Expert'
    },
    {
        id: 'hangman',
        name: 'Ninja Hangman',
        description: 'Guess the secret word to save the ninja!',
        icon: FaUserSecret,
        path: '/funzone/hangman',
        category: 'Word',
        accentColor: '#E63946',
        difficulty: 'Medium'
    },
    {
        id: 'geometry-dash',
        name: 'Neon Dash',
        description: 'Jump through obstacles in this rhythm runner!',
        icon: FaSquare,
        path: '/funzone/geometry-dash',
        category: 'Arcade',
        accentColor: '#00F2FE',
        difficulty: 'Hard'
    }
];
