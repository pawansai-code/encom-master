import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../../Components/Homepage/HomeNavbar';
import './styles/Tools.css';
import { TOOLS_CONFIG } from './toolsConfig';

const ToolsHub = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    const categories = ['All', ...new Set(TOOLS_CONFIG.map(tool => tool.category))];

    const filteredTools = TOOLS_CONFIG.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="tools-page-container">
            <HomeNavbar />
            
            <div className="container py-5 mt-5">
                <div className="tools-header text-center fade-in-up">
                    <h1 className="text-gradient">Ninja Tools System</h1>
                    <p className="lead text-secondary">
                        A collection of powerful utilities to boost your productivity.
                    </p>
                    
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0 border-secondary">
                                    <FaSearch className="text-secondary" />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-start-0 border-secondary text-light" 
                                    placeholder="Search for tools..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                className={`btn rounded-pill px-3 py-1 btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="row g-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {filteredTools.map((tool) => (
                        <div key={tool.id} className="col-md-6 col-lg-4 col-xl-3">
                            <div 
                                className="tool-card d-flex flex-column"
                                onClick={() => navigate(tool.path)}
                                style={{ 
                                    '--tool-color': tool.accentColor, 
                                    '--tool-glow': `${tool.accentColor}40` 
                                }}
                            >
                                <span className="tool-category-badge">
                                    {tool.category}
                                </span>
                                <div 
                                    className="tool-icon-wrapper"
                                    style={{ color: tool.accentColor }}
                                >
                                    <tool.icon />
                                </div>
                                <h3 className="tool-title">{tool.name}</h3>
                                <p className="tool-desc">{tool.description}</p>
                            </div>
                        </div>
                    ))}
                    
                    {filteredTools.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <h3 className="text-secondary">No tools found matching your criteria.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolsHub;
