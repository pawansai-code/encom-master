
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaRedo, FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { submitScore } from '../../../State/slices/gameSlice';

const TRIVIA_QUESTIONS = [
    {
        id: 1,
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mark Language", "Home Tool Markup Language"],
        answer: 0
    },
    {
        id: 2,
        question: "Which language is primarily used for React?",
        options: ["Python", "Java", "JavaScript", "C#"],
        answer: 2
    },
    {
        id: 3,
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Kyoto"],
        answer: 2
    },
    {
        id: 4,
        question: "What is the shadow warrior often called?",
        options: ["Samurai", "Ninja", "Ronin", "Shogun"],
        answer: 1
    },
    {
        id: 5,
        question: "Which symbol denotes an ID in CSS?",
        options: [".", "#", "@", "*"],
        answer: 1
    },
    {
        id: 6,
        question: "In Redux, what updates the state?",
        options: ["Dispatcher", "Reducer", "Action", "Store"],
        answer: 1
    },
    {
        id: 7,
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 2
    },
    {
        id: 8,
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        answer: 1
    },
    {
        id: 9,
        question: "What assumes the value of 'false' in JavaScript?",
        options: ["'0'", "[]", "0", "{}"],
        answer: 2
    },
    {
        id: 10,
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        answer: 1
    }
];

const TIMER_SECONDS = 15;

export const NinjaTriviaGame = () => {
    const dispatch = useDispatch();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const [isGameOver, setIsGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        const storedHighScore = localStorage.getItem('ninjaTriviaHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    // Timer Logic
    useEffect(() => {
        if (!isAnswered && !isGameOver && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isAnswered && !isGameOver) {
            handleTimeUp();
        }
    }, [timeLeft, isAnswered, isGameOver]);

    const handleTimeUp = () => {
        setIsAnswered(true);
        setSelectedOption(-1); // No selection
        // Automatically go to next after delay
        setTimeout(nextQuestion, 2000);
    };

    const handleOptionClick = (index) => {
        if (isAnswered || isGameOver) return;
        
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === TRIVIA_QUESTIONS[currentQuestionIndex].answer) {
            // Correct - Add Score based on time left
            const bonus = timeLeft * 10;
            setScore(prev => prev + 100 + bonus);
        }
        
        // Delay for feedback then next question
        setTimeout(nextQuestion, 2000);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < TRIVIA_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setTimeLeft(TIMER_SECONDS);
        } else {
            endGame();
        }
    };

    const endGame = () => {
        setIsGameOver(true);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('ninjaTriviaHighScore', score.toString());
        }
        dispatch(submitScore({ gameId: 'trivia', score: score, user: 'You' }));
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsGameOver(false);
        setTimeLeft(TIMER_SECONDS);
    };

    const currentQ = TRIVIA_QUESTIONS[currentQuestionIndex];

    return (
        <div className="d-flex flex-column align-items-center w-100">
             {/* HUD */}
             <div className="d-flex justify-content-between w-100 px-4 mb-4" style={{ maxWidth: '800px' }}>
                <div className="text-info fs-5 game-font">
                    SCORE: <span className="text-white">{score}</span>
                </div>
                 <div className={`fs-5 game-font ${timeLeft < 5 ? 'text-danger animate-pulse' : 'text-warning'}`}>
                    <FaClock className="me-2" />
                    {timeLeft}s
                </div>
                 <div className="text-success fs-5 game-font">
                    BEST: <span className="text-white">{Math.max(score, highScore)}</span>
                </div>
            </div>

            <div className="game-container p-4 p-md-5 rounded-4 border border-secondary bg-dark bg-opacity-75 w-100 shadow-lg" style={{ maxWidth: '800px', minHeight: '400px' }}>
                
                {isGameOver ? (
                     <div className="text-center h-100 d-flex flex-column justify-content-center align-items-center">
                        <h2 className="display-4 fw-bold text-gradient mb-4">Quiz Complete!</h2>
                        <div className="fs-1 mb-2">🏆</div>
                        <p className="fs-3 text-white mb-4">Final Score: <span className="text-warning fw-bold">{score}</span></p>
                        <p className="text-secondary mb-5">
                            You answered {Math.round(score / 150)} questions correctly!
                        </p>
                        <button 
                            className="btn btn-lg btn-primary rounded-pill px-5 py-3 game-font glow-effect"
                            onClick={restartGame}
                        >
                            <FaRedo className="me-2" /> Play Again
                        </button>
                    </div>
                ) : (
                    <div className="fade-in-up">
                        <div className="d-flex justify-content-between text-secondary text-uppercase small mb-3 tracking-widest">
                            <span>Question {currentQuestionIndex + 1} / {TRIVIA_QUESTIONS.length}</span>
                            <span>{TRIVIA_QUESTIONS[currentQuestionIndex].category || 'General'}</span>
                        </div>
                        
                        <h3 className="text-white mb-5 fw-bold text-center" style={{ minHeight: '80px' }}>
                            {currentQ.question}
                        </h3>

                        <div className="row g-3">
                            {currentQ.options.map((option, idx) => {
                                let btnClass = "btn-outline-light";
                                if (isAnswered) {
                                    if (idx === currentQ.answer) btnClass = "btn-success border-success text-white bg-success bg-opacity-50"; // Correct
                                    else if (idx === selectedOption) btnClass = "btn-danger border-danger text-white bg-danger bg-opacity-50"; // Wrong pick
                                    else btnClass = "btn-outline-secondary opacity-50"; // Others
                                }

                                return (
                                    <div key={idx} className="col-12 col-md-6">
                                        <button 
                                            className={`btn w-100 p-3 text-start fw-bold rounded-3 transition-all ${btnClass}`}
                                            onClick={() => handleOptionClick(idx)}
                                            disabled={isAnswered}
                                            style={{ minHeight: '60px' }}
                                        >
                                            <span className="badge bg-dark bg-opacity-50 me-3 text-white border border-secondary rounded-circle" style={{ width: '30px', height: '30px', lineHeight: '22px' }}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {option}
                                            {isAnswered && idx === currentQ.answer && <FaCheckCircle className="float-end mt-1" />}
                                            {isAnswered && idx === selectedOption && idx !== currentQ.answer && <FaTimesCircle className="float-end mt-1" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
             <div className="mt-4 text-center text-secondary small">
                <p>Select the correct answer before time runs out!</p>
            </div>
        </div>
    );
};
