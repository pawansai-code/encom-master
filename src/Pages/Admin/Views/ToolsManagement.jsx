import { useState } from 'react';
import { FaCheck, FaEdit, FaKey, FaToggleOff, FaToggleOn } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTools, toggleToolStatus, updateToolKey } from '../../../State/slices/adminSlice';

const ToolsManagement = () => {
    const dispatch = useDispatch();
    const tools = useSelector(selectAllTools);
    const [editingKey, setEditingKey] = useState(null);
    const [tempKey, setTempKey] = useState('');

    const handleKeyEdit = (tool) => {
        setEditingKey(tool.id);
        setTempKey(tool.apiKey || '');
    };

    const saveKey = (id) => {
        dispatch(updateToolKey({ id, key: tempKey }));
        setEditingKey(null);
    };

    return (
        <div className="admin-content-view animate-fade-in">
            <h3 className="fw-bold mb-4">Tools Management</h3>

            <div className="row g-4">
                {tools.map(tool => (
                    <div key={tool.id} className="col-12 col-md-6 col-lg-4">
                        <div className="admin-card h-100 d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h5 className="fw-bold mb-0">{tool.name}</h5>
                                <div 
                                    className={`form-check form-switch cursor-pointer`} 
                                    title="Toggle Tool Status"
                                >
                                    {tool.status === 'active' ? (
                                        <FaToggleOn size={30} className="text-success" onClick={() => dispatch(toggleToolStatus(tool.id))} style={{cursor:'pointer'}} />
                                    ) : (
                                        <FaToggleOff size={30} className="text-muted" onClick={() => dispatch(toggleToolStatus(tool.id))} style={{cursor:'pointer'}} />
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex justify-content-between text-muted small mb-1">
                                    <span>Status</span>
                                    <span className={`badge ${tool.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{tool.status}</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small">
                                    <span>Weekly Usage</span>
                                    <span>{tool.usage.toLocaleString()} invocations</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-top border-secondary border-opacity-10">
                                <label className="small text-muted mb-1 d-flex align-items-center gap-2">
                                    <FaKey size={12} /> API Key Configuration
                                </label>
                                {editingKey === tool.id ? (
                                    <div className="input-group input-group-sm">
                                        <input 
                                            type="text" 
                                            className="form-control bg-dark text-white border-secondary" 
                                            value={tempKey}
                                            onChange={(e) => setTempKey(e.target.value)}
                                        />
                                        <button className="btn btn-success" onClick={() => saveKey(tool.id)}><FaCheck /></button>
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-between align-items-center bg-black bg-opacity-20 p-2 rounded">
                                        <code className="text-truncate small text-muted" style={{maxWidth: '180px'}}>
                                            {tool.apiKey ? `${tool.apiKey.substring(0, 8)}...` : 'Not Configured'}
                                        </code>
                                        <button className="btn btn-sm btn-link text-info p-0" onClick={() => handleKeyEdit(tool)}>
                                            <FaEdit />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Analytics Section Stub */}
            <div className="admin-card mt-4">
                <h5 className="fw-bold mb-3">Global Tool Analytics</h5>
                <div className="d-flex justify-content-center align-items-center text-muted p-5 bg-black bg-opacity-20 rounded" style={{border: '1px dashed #444'}}>
                    Visualization of tool usage metrics over time would go here.
                </div>
            </div>
        </div>
    );
};

export default ToolsManagement;
