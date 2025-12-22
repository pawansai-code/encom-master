import {
    FaCalculator,
    FaCode,
    FaExchangeAlt,
    FaFileAlt,
    FaFilePdf,
    FaImage,
    FaLanguage,
    FaRobot,
    FaSearch
} from 'react-icons/fa';

export const TOOLS_CONFIG = [
    {
        id: 'calculator',
        name: 'Calculator',
        description: 'Advanced calculator for your math needs.',
        icon: FaCalculator,
        path: '/tools/calculator',
        category: 'Utility',
        accentColor: '#4ECDC4'
    },
    {
        id: 'scientific-calculator',
        name: 'Scientific Calculator',
        description: 'Perform complex mathematical calculations.',
        icon: FaCalculator,
        path: '/tools/scientific-calculator',
        category: 'Utility',
        accentColor: '#118AB2'
    },
    {
        id: 'summarizer',
        name: 'Text Summarizer',
        description: 'Condense long articles into short summaries.',
        icon: FaFileAlt,
        path: '/tools/summarizer',
        category: 'Productivity',
        accentColor: '#FF6B6B'
    },
    {
        id: 'translator',
        name: 'Language Translator',
        description: 'Translate text between multiple languages.',
        icon: FaLanguage,
        path: '/tools/translator',
        category: 'Productivity',
        accentColor: '#45B7D1'
    },
    {
        id: 'text-analyzer',
        name: 'Text Analyzer',
        description: 'Analyze word count, sentiment, and readability.',
        icon: FaSearch,
        path: '/tools/text-analyzer',
        category: 'Utility',
        accentColor: '#96CEB4'
    },
    {
        id: 'ai-chat',
        name: 'AI Assistant',
        description: 'Chat with our advanced AI companion.',
        icon: FaRobot,
        path: '/tools/ai-chat',
        category: 'AI',
        accentColor: '#A06CD5'
    },
    {
        id: 'pdf-tools',
        name: 'PDF Tools',
        description: 'Merge, split, and compress PDF files.',
        icon: FaFilePdf,
        path: '/tools/pdf-tools',
        category: 'Files',
        accentColor: '#FF9F1C'
    },
    {
        id: 'image-tools',
        name: 'Image Editor',
        description: 'Resize, compress, and convert images.',
        icon: FaImage,
        path: '/tools/image-tools',
        category: 'Media',
        accentColor: '#2EC4B6'
    },
    {
        id: 'code-formatter',
        name: 'Code Formatter',
        description: 'Beautify your code instantly.',
        icon: FaCode,
        path: '/tools/code-formatter',
        category: 'Development',
        accentColor: '#E71D36'
    },
    {
        id: 'file-converter',
        name: 'File Converter',
        description: 'Convert files between different formats.',
        icon: FaExchangeAlt,
        path: '/tools/file-converter',
        category: 'Files',
        accentColor: '#011627'
    }
];
