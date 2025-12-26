import { useState } from 'react';
import { FaPaperPlane, FaRobot, FaTrash } from 'react-icons/fa';

// --- Scientific Calculator ---
export const ScientificCalculatorTool = () => {
    const [display, setDisplay] = useState('');
    
    const handleClick = (value) => {
        if (value === 'C') {
            setDisplay('');
        } else if (value === 'DEL') {
            setDisplay(display.slice(0, -1));
        } else if (value === '=') {
            try {
                // Replace scientific functions with Math equivalents
                // Note: This is a simple replacement and might fail for complex nested expressions without proper parsing,
                // but sufficient for a basic "scientific" demo.
                let expression = display
                    .replace(/sin/g, 'Math.sin')
                    .replace(/cos/g, 'Math.cos')
                    .replace(/tan/g, 'Math.tan')
                    .replace(/log/g, 'Math.log10')
                    .replace(/ln/g, 'Math.log')
                    .replace(/sqrt/g, 'Math.sqrt')
                    .replace(/π/g, 'Math.PI')
                    .replace(/e/g, 'Math.E')
                    .replace(/\^/g, '**');

                // eslint-disable-next-line no-new-func
                const result = new Function('return ' + expression)();
                setDisplay(String(result));
            } catch (err) {
                setDisplay('Error');
            }
        } else {
            setDisplay(display + value);
        }
    };

    const buttons = [
        'sin', 'cos', 'tan', 'C', 'DEL',
        'log', 'ln', 'sqrt', '(', ')',
        '7', '8', '9', '/', '^',
        '4', '5', '6', '*', 'π',
        '1', '2', '3', '-', 'e',
        '0', '.', '=', '+', '%'
    ];

    return (
        <div className="d-flex flex-column align-items-center">
            <input 
                type="text" 
                className="form-control mb-3 text-end fs-2 bg-dark text-white border-secondary" 
                value={display} 
                readOnly 
                style={{ maxWidth: '400px' }}
            />
            <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)', maxWidth: '400px' }}>
                {buttons.map(btn => (
                    <button 
                        key={btn} 
                        className={`btn ${btn === 'C' || btn === 'DEL' ? 'btn-danger' : btn === '=' ? 'btn-primary' : 'btn-secondary'} p-3 fw-bold`}
                        style={btn === '=' ? { backgroundColor: 'var(--tool-primary)', borderColor: 'var(--tool-primary)', color: 'white' } : {}}
                        onClick={() => handleClick(btn)}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Standard Calculator ---
export const CalculatorTool = () => {
    const [display, setDisplay] = useState('');
    
    const handleClick = (value) => {
        if (value === 'C') setDisplay('');
        else if (value === '=') {
            try {
                // eslint-disable-next-line no-new-func
                setDisplay(new Function('return ' + display)().toString());
            } catch {
                setDisplay('Error');
            }
        } else {
            setDisplay(display + value);
        }
    };

    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
        'C', '(', ')', '%'
    ];

    return (
        <div className="d-flex flex-column align-items-center">
            <input 
                type="text" 
                className="form-control mb-3 text-end fs-2 bg-dark text-white border-secondary" 
                value={display} 
                readOnly 
                style={{ maxWidth: '300px' }}
            />
            <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '300px' }}>
                {buttons.map(btn => (
                    <button 
                        key={btn} 
                        className={`btn ${btn === 'C' ? 'btn-danger' : 'btn-secondary'} p-3 fw-bold`}
                        style={btn === '=' ? { backgroundColor: 'var(--tool-primary)', borderColor: 'var(--tool-primary)', color: 'white' } : {}}
                        onClick={() => handleClick(btn)}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Text Summarizer ---
export const SummarizerTool = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSummarize = () => {
        setLoading(true);
        setTimeout(() => {
            // Mock logic: take first 2 sentences
            const sentences = text.split('. ');
            setSummary(sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '.'));
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <label className="form-label">Input Text</label>
                <textarea 
                    className="form-control textarea-custom mb-3" 
                    rows="10" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your article here..."
                ></textarea>
                <button 
                    className="btn w-100 text-white" 
                    style={{ backgroundColor: 'var(--tool-primary)', border: 'none' }}
                    onClick={handleSummarize}
                    disabled={!text || loading}
                >
                    {loading ? 'Summarizing...' : 'Summarize Text'}
                </button>
            </div>
            <div className="col-md-6 mt-4 mt-md-0">
                <label className="form-label">Summary</label>
                <div className="p-3 border border-secondary rounded h-100 bg-black bg-opacity-25 text-white">
                    {summary || <span className="text-secondary">Summary will appear here...</span>}
                </div>
            </div>
        </div>
    );
};

// --- Translator ---
export const TranslatorTool = () => {
    const [text, setText] = useState('');
    const [targetLang, setTargetLang] = useState('es');
    const [translated, setTranslated] = useState('');

    const handleTranslate = () => {
        // Mock translation
        const mocks = {
            es: "Hola mundo (Spanish mock)",
            fr: "Bonjour le monde (French mock)",
            de: "Hallo Welt (German mock)",
            ja: "こんにちは世界 (Japanese mock)"
        };
        setTranslated(mocks[targetLang] + " - " + text);
    };

    return (
        <div className="row">
            <div className="col-md-5">
                <select className="form-select bg-dark text-white border-secondary mb-2">
                    <option value="en">English</option>
                </select>
                <textarea 
                    className="form-control textarea-custom" 
                    rows="8" 
                    value={text} 
                    onChange={e => setText(e.target.value)}
                ></textarea>
            </div>
            <div className="col-md-2 d-flex align-items-center justify-content-center py-3">
                <button 
                    className="btn rounded-circle p-3 text-white" 
                    style={{ backgroundColor: 'var(--tool-primary)', border: 'none' }}
                    onClick={handleTranslate}
                >
                    <FaRobot />
                </button>
            </div>
            <div className="col-md-5">
                <select 
                    className="form-select bg-dark text-white border-secondary mb-2"
                    value={targetLang}
                    onChange={e => setTargetLang(e.target.value)}
                >
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                </select>
                <textarea 
                    className="form-control textarea-custom" 
                    rows="8" 
                    readOnly 
                    value={translated}
                ></textarea>
            </div>
        </div>
    );
};

// --- Text Analyzer ---
export const TextAnalyzerTool = () => {
    const [text, setText] = useState('');
    
    const stats = {
        chars: text.length,
        words: text.trim() ? text.trim().split(/\s+/).length : 0,
        sentences: text.split(/[.!?]+/).length - 1,
        paragraphs: text.split(/\n\n+/).length
    };

    return (
        <div>
            <textarea 
                className="form-control textarea-custom mb-4" 
                rows="8" 
                value={text} 
                onChange={e => setText(e.target.value)}
                placeholder="Type or paste text to analyze..."
            ></textarea>
            
            <div className="row g-3 text-center">
                {Object.entries(stats).map(([key, value]) => (
                    <div className="col-6 col-md-3" key={key}>
                        <div className="p-3 border border-secondary rounded bg-black bg-opacity-25" style={{ borderColor: 'var(--tool-primary-glass)' }}>
                            <h3 className="fw-bold mb-0" style={{ color: 'var(--tool-primary)' }}>{value}</h3>
                            <small className="text-uppercase text-secondary fw-bold">{key}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- AI Chat ---
export const AIChatTool = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const newMsgs = [...messages, { role: 'user', text: input }];
        setMessages(newMsgs);
        setInput('');
        
        setTimeout(() => {
            setMessages([...newMsgs, { role: 'ai', text: "I'm just a simulated AI, but I hear you!" }]);
        }, 1000);
    };

    return (
        <div className="d-flex flex-column h-100" style={{ minHeight: '500px' }}>
            <div className="flex-grow-1 overflow-auto p-3 mb-3 border border-secondary rounded bg-black bg-opacity-25">
                {messages.map((msg, i) => (
                    <div key={i} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : ''}`}>
                        <div 
                            className={`p-3 rounded-3 ${msg.role === 'user' ? 'text-white' : 'bg-secondary text-light'}`} 
                            style={msg.role === 'user' ? { backgroundColor: 'var(--tool-primary)', maxWidth: '75%' } : { maxWidth: '75%' }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-group">
                <input 
                    type="text" 
                    className="form-control bg-transparent border-secondary text-white" 
                    placeholder="Type a message..." 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--tool-primary)', borderColor: 'var(--tool-primary)' }} onClick={handleSend}><FaPaperPlane /></button>
            </div>
        </div>
    );
};

// --- Code Formatter ---
export const CodeFormatterTool = () => {
    const [code, setCode] = useState('');
    
    // Very dummy formatter
    const format = () => {
        try {
            const formatted = JSON.stringify(JSON.parse(code), null, 4);
            setCode(formatted);
        } catch (e) {
            // If not JSON, just trim lines (dummy)
            setCode(code.split('\n').map(l => l.trim()).join('\n'));
        }
    };

    return (
        <div className="h-100">
            <div className="d-flex justify-content-between mb-2">
                <button className="btn btn-sm btn-outline-light" onClick={() => setCode('')}><FaTrash /> Clear</button>
                <button className="btn btn-sm btn-primary" style={{ backgroundColor: 'var(--tool-primary)', borderColor: 'var(--tool-primary)' }} onClick={format}>Format Code</button>
            </div>
            <textarea 
                className="form-control textarea-custom font-monospace" 
                rows="15" 
                value={code} 
                onChange={e => setCode(e.target.value)}
                placeholder="// Paste code (JSON supported for pretty print)"
            ></textarea>
        </div>
    );
};

// --- Generic File Tool (PDF, Image, Video, Converter) ---
export const FileTool = ({ type }) => {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const handleFile = (e) => setFile(e.target.files[0]);

    const process = () => {
        if (!file) return;
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setResult(`Processed ${file.name} successfully! (Mock)`);
        }, 2000);
    };

    return (
        <div className="text-center py-5">
            <div className="border border-dashed border-secondary rounded p-5 mb-4" style={{ borderStyle: 'dashed' }}>
                <input type="file" className="d-none" id="fileInput" onChange={handleFile} />
                <label htmlFor="fileInput" className="btn btn-outline-primary btn-lg" style={{ color: 'var(--tool-primary)', borderColor: 'var(--tool-primary)' }}>
                   {file ? 'Change File' : 'Select File'}
                </label>
                {file && <p className="mt-3 text-success">{file.name}</p>}
                <p className="mt-2 text-secondary small">Supported formats: {type === 'image' ? 'JPG, PNG' : type === 'pdf' ? 'PDF' : 'All'}</p>
            </div>
            
            <button 
                className="btn btn-success px-5" 
                style={{ backgroundColor: 'var(--tool-primary)', borderColor: 'var(--tool-primary)' }} 
                disabled={!file || processing}
                onClick={process}
            >
                {processing ? 'Processing...' : 'Start Processing'}
            </button>

            {result && (
                <div className="mt-4 p-3 bg-opacity-25 border rounded" style={{ borderColor: 'var(--tool-primary)', backgroundColor: 'var(--tool-primary-glass)', color: 'var(--tool-primary)' }}>
                    {result}
                </div>
            )}
        </div>
    );
};
