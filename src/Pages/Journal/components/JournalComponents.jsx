import { useState } from 'react';
import { FaCheck, FaFire, FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    addHabit,
    addTodo,
    deleteHabit,
    deleteTodo,
    toggleHabit,
    toggleTodo
} from '../../../State/slices/journalSlice';

// --- Heatmap Calendar ---
// --- Heatmap Calendar ---
export const HeatmapCalendar = ({ onDateClick, selectedDate }) => {
    const entries = useSelector(state => state.journal.entries);
    
    // Generate last 35 days (5 weeks) for a better grid
    const days = [];
    const today = new Date();
    // Start from 4 weeks ago, aligned to sunday if possible, but for now just last 35 days
    for (let i = 34; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const entryCount = entries.filter(e => e.date === dateStr).length;
        let level = 0;
        if (entryCount >= 1) level = 1;
        if (entryCount >= 3) level = 2;
        if (entryCount >= 5) level = 3;
        
        days.push({ 
            date: dateStr, 
            day: d.getDate(), 
            level,
            isToday: i === 0,
            isSelected: selectedDate === dateStr
        });
    }

    return (
        <div className="journal-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Activity Log</h5>
                <span className="badge bg-secondary bg-opacity-25 text-secondary">Last 35 Days</span>
            </div>
            <div className="heatmap-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {['S','M','T','W','T','F','S'].map((d, i) => (
                    <div key={i} className="text-center xsmall text-secondary fw-bold mb-2">{d}</div>
                ))}
                {days.map((day, i) => (
                    <div 
                        key={i} 
                        className={`heatmap-cell heatmap-level-${day.level} ${day.isToday ? 'heatmap-today' : ''} ${day.isSelected ? 'heatmap-selected' : ''}`}
                        title={`${day.date}: ${day.level} entries`}
                        onClick={() => onDateClick && onDateClick(day.date)}
                        style={{ cursor: 'pointer' }}
                    >
                        {day.day}
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-between mt-4 small text-secondary align-items-center">
                <span className="xsmall">Less</span>
                <div className="d-flex gap-1">
                    <div className="heatmap-cell" style={{width: 12, height: 12, fontSize: 0, minHeight: 0}}></div>
                    <div className="heatmap-cell heatmap-level-1" style={{width: 12, height: 12, fontSize: 0, minHeight: 0}}></div>
                    <div className="heatmap-cell heatmap-level-2" style={{width: 12, height: 12, fontSize: 0, minHeight: 0}}></div>
                    <div className="heatmap-cell heatmap-level-3" style={{width: 12, height: 12, fontSize: 0, minHeight: 0}}></div>
                </div>
                <span className="xsmall">More</span>
            </div>
        </div>
    );
};

// --- Todo Manager ---
export const TodoManager = () => {
    const dispatch = useDispatch();
    const todos = useSelector(state => state.journal.todos);
    const [input, setInput] = useState('');

    const handleAdd = () => {
        if (input.trim()) {
            dispatch(addTodo(input.trim()));
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAdd();
    };

    const completedCount = todos.filter(t => t.completed).length;

    return (
        <div className="journal-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Tasks</h5>
                <span className="small text-secondary">
                    {completedCount}/{todos.length} Done
                </span>
            </div>
            
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control bg-transparent text-light border-secondary"
                    placeholder="Add a new task..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="btn btn-outline-primary" onClick={handleAdd}>
                    <FaPlus />
                </button>
            </div>

            <div className="todo-list custom-scrollbar pr-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {todos.map(todo => (
                    <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <div 
                            className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                            onClick={() => dispatch(toggleTodo(todo.id))}
                        >
                            {todo.completed && <FaCheck size={10} color="white" />}
                        </div>
                        <span className="flex-grow-1 text-break">{todo.text}</span>
                        <button className="btn btn-sm text-secondary hover-danger opacity-50 hover-opacity-100" onClick={() => dispatch(deleteTodo(todo.id))}>
                            <FaTrash />
                        </button>
                    </div>
                ))}
                {todos.length === 0 && (
                    <div className="text-center py-4 text-secondary opacity-50">
                        <p className="small mb-0">No tasks yet. Stay productive!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Habit Tracker ---
export const HabitTracker = () => {
    const dispatch = useDispatch();
    const habits = useSelector(state => state.journal.habits);
    const [input, setInput] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const handleAdd = () => {
        if (input.trim()) {
            dispatch(addHabit(input.trim()));
            setInput('');
        }
    };

    return (
        <div className="journal-card">
            <h5 className="fw-bold mb-3">Habit Tracker</h5>
            
            <div className="input-group mb-4">
                <input 
                    type="text" 
                    className="form-control bg-transparent text-light border-secondary"
                    placeholder="New habit..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button className="btn btn-primary" onClick={handleAdd}><FaPlus /></button>
            </div>

            <div className="habit-list custom-scrollbar pr-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {habits.map(habit => {
                    const isDoneToday = habit.completedDates.includes(today);
                    return (
                        <div key={habit.id} className="habit-row">
                            <div className="d-flex align-items-center gap-3 flex-grow-1">
                                <button 
                                    className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center transition-all ${isDoneToday ? 'btn-success scale-110' : 'btn-outline-secondary'}`}
                                    style={{ width: 32, height: 32, padding: 0, flexShrink: 0 }}
                                    onClick={() => dispatch(toggleHabit({ id: habit.id, date: today }))}
                                >
                                    <FaCheck size={12} />
                                </button>
                                <span className={`text-break ${isDoneToday ? 'text-decoration-line-through opacity-50' : ''}`}>
                                    {habit.name}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div className="habit-streak" title={`Current Streak: ${habit.streak}`}>
                                    <FaFire className="me-1" /> {habit.streak}
                                </div>
                                <button className="btn btn-sm text-secondary hover-danger p-1" onClick={() => dispatch(deleteHabit(habit.id))}>
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {habits.length === 0 && (
                    <div className="text-center py-4 text-secondary opacity-50">
                        <p className="small mb-0">Start a new good habit today!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
