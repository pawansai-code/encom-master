import { useEffect } from 'react';
import { FaChevronLeft, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import { recordToolUsage, toggleFavorite } from '../../State/slices/toolSlice';
import {
    AIChatTool,
    CalculatorTool,
    CodeFormatterTool,
    FileTool,
    ScientificCalculatorTool,
    SummarizerTool,
    TextAnalyzerTool,
    TranslatorTool
} from './components/ToolComponents';
import './styles/Tools.css';
import { TOOLS_CONFIG } from './toolsConfig';

const ToolView = () => {
    const { toolId } = useParams();
    const tool = TOOLS_CONFIG.find(t => t.id === toolId);
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.tools.favorites);
    const isFavorite = favorites.includes(toolId);
    
    // Scroll to top on change and record usage
    useEffect(() => {
        window.scrollTo(0, 0);
        if (toolId) {
            dispatch(recordToolUsage(toolId));
        }
    }, [toolId, dispatch]);

    if (!tool) {
        return <div className="text-white text-center py-5">Tool not found.</div>;
    }

    const renderTool = () => {
        switch (toolId) {
            case 'calculator': return <CalculatorTool />;
            case 'scientific-calculator': return <ScientificCalculatorTool />;
            case 'summarizer': return <SummarizerTool />;
            case 'translator': return <TranslatorTool />;
            case 'text-analyzer': return <TextAnalyzerTool />;
            case 'ai-chat': return <AIChatTool />;
            case 'code-formatter': return <CodeFormatterTool />;
            case 'pdf-tools': return <FileTool type="pdf" />;
            case 'image-tools': return <FileTool type="image" />;
            case 'file-converter': return <FileTool type="file" />;
            default: return <div className="text-center">Tool implementation coming soon...</div>;
        }
    };

    return (
        <div 
            className="tools-page-container" 
            style={{ 
                '--tool-primary': tool.accentColor,
                '--tool-primary-glass': `${tool.accentColor}20`,
                '--tool-primary-glow': `${tool.accentColor}60`
            }}
        >
            <HomeNavbar />
            
            <div className="container py-5 mt-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <Link to="/tools" className="text-decoration-none text-secondary d-inline-flex align-items-center mb-3 hover-white">
                            <FaChevronLeft className="me-2" /> Back to Tools
                        </Link>
                        <div className="d-flex align-items-center gap-3">
                            <div 
                                className="tool-icon-wrapper mb-0"
                                style={{ color: tool.accentColor, width: '60px', height: '60px', fontSize: '2rem' }}
                            >
                                <tool.icon />
                            </div>
                            <div>
                                <h1 className="fw-bold mb-0">{tool.name}</h1>
                                <p className="text-secondary mb-0">{tool.description}</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-secondary'} rounded-circle p-3 d-flex align-items-center justify-content-center`}
                        style={{ width: '50px', height: '50px' }}
                        onClick={() => dispatch(toggleFavorite(toolId))}
                        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>

                <div className="row g-4">
                    <div className="col-lg-9">
                        <div className="tool-workspace fade-in-up">
                            {renderTool()}
                        </div>
                    </div>
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="tool-sidebar fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h5 className="fw-bold mb-3">More Tools</h5>
                            <div className="d-flex flex-column gap-2">
                                {TOOLS_CONFIG.filter(t => t.id !== toolId).slice(0, 5).map(t => (
                                    <Link 
                                        key={t.id} 
                                        to={t.path} 
                                        className="text-decoration-none text-light p-2 rounded hover-bg-light d-flex align-items-center gap-2"
                                    >
                                        <t.icon className="text-secondary" />
                                        <span className="small">{t.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolView;
