import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

// --- GPA Calculator ---
export const GPACalculatorTool = () => {
    const [courses, setCourses] = useState([{ id: 1, credits: '', gradePoints: '' }]);
    const [result, setResult] = useState(null);

    const addCourse = () => {
        setCourses([...courses, { id: Date.now(), credits: '', gradePoints: '' }]);
    };

    const removeCourse = (id) => {
        if (courses.length > 1) {
            setCourses(courses.filter(course => course.id !== id));
        }
    };

    const handleChange = (id, field, value) => {
        setCourses(courses.map(course => 
            course.id === id ? { ...course, [field]: value } : course
        ));
    };

    const calculate = () => {
        let totalCredits = 0;
        let weightedSum = 0;
        let valid = true;

        courses.forEach(course => {
            const credits = parseFloat(course.credits);
            const gradePoints = parseFloat(course.gradePoints);

            if (isNaN(credits) || isNaN(gradePoints)) {
                valid = false;
            } else {
                totalCredits += credits;
                weightedSum += (credits * gradePoints);
            }
        });

        if (!valid || totalCredits === 0) {
            setResult('Please enter valid numbers for all fields.');
            return;
        }

        const gpa = weightedSum / totalCredits;
        setResult(`Your GPA is: ${gpa.toFixed(2)}`);
    };

    const clear = () => {
        setCourses([{ id: 1, credits: '', gradePoints: '' }]);
        setResult(null);
    };

    return (
        <div className="container p-0">
             <div className="alert alert-info border-0 text-white mb-4" style={{ backgroundColor: 'var(--tool-primary-glass)', borderColor: 'var(--tool-primary)' }}>
                <strong>Formula:</strong> GPA = (Credits × Grade Points) / Total Credits
            </div>

            <div className="table-responsive">
                <table className="table table-dark table-borderless bg-transparent">
                    <thead>
                        <tr>
                            <th className="text-secondary">Course</th>
                            <th className="text-secondary">Credits</th>
                            <th className="text-secondary">Grade Points</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={course.id}>
                                <td className="align-middle text-white" data-label="Course #">
                                    <span className="d-lg-none me-2">Course</span>{index + 1}
                                </td>
                                <td data-label="Credits">
                                    <input
                                        type="number"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="Credits"
                                        value={course.credits}
                                        onChange={(e) => handleChange(course.id, 'credits', e.target.value)}
                                    />
                                </td>
                                <td data-label="Grade Points">
                                    <input
                                        type="number"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="Points"
                                        value={course.gradePoints}
                                        onChange={(e) => handleChange(course.id, 'gradePoints', e.target.value)}
                                    />
                                </td>
                                <td data-label="Actions" className="text-end">
                                    <button 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => removeCourse(course.id)}
                                        disabled={courses.length === 1}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex gap-2 mb-4">
                <button className="btn btn-secondary" onClick={addCourse}>
                    <FaPlus /> Add Course
                </button>
                <button 
                    className="btn btn-primary" 
                    style={{ backgroundColor: 'var(--tool-primary)', borderColor: 'var(--tool-primary)' }}
                    onClick={calculate}
                >
                    Calculate GPA
                </button>
                <button className="btn btn-outline-light" onClick={clear}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="p-4 rounded text-center border mt-3" style={{ backgroundColor: 'var(--tool-primary-glass)', borderColor: 'var(--tool-primary)' }}>
                    <h2 className="mb-0 fw-bold text-white">{result}</h2>
                </div>
            )}
        </div>
    );
};

// --- CGPA Calculator ---
export const CGPACalculatorTool = () => {
    const [semesters, setSemesters] = useState([{ id: 1, gpa: '' }]);
    const [result, setResult] = useState(null);

    const addSemester = () => {
        setSemesters([...semesters, { id: Date.now(), gpa: '' }]);
    };

    const removeSemester = (id) => {
        if (semesters.length > 1) {
            setSemesters(semesters.filter(sem => sem.id !== id));
        }
    };

    const handleChange = (id, value) => {
        setSemesters(semesters.map(sem => 
            sem.id === id ? { ...sem, gpa: value } : sem
        ));
    };

    const calculate = () => {
        let totalGPA = 0;
        let count = 0;
        let valid = true;

        semesters.forEach(sem => {
            const gpa = parseFloat(sem.gpa);
            if (isNaN(gpa)) {
                valid = false;
            } else {
                totalGPA += gpa;
                count++;
            }
        });

        if (!valid || count === 0) {
            setResult('Please enter valid GPA for all semesters.');
            return;
        }

        const cgpa = totalGPA / count;
        setResult(`Your CGPA is: ${cgpa.toFixed(2)}`);
    };

    const clear = () => {
        setSemesters([{ id: 1, gpa: '' }]);
        setResult(null);
    };

    return (
        <div className="container p-0">
             <div className="alert alert-info border-0 text-white mb-4" style={{ backgroundColor: 'var(--tool-primary-glass)', borderColor: 'var(--tool-primary)' }}>
                <strong>Formula:</strong> CGPA = Sum Total GPA / Number of Semesters
            </div>

            <div className="row g-3 mb-4">
                {semesters.map((sem, index) => (
                    <div key={sem.id} className="col-12 col-md-6 col-lg-4">
                        <div className="input-group">
                            <span className="input-group-text bg-dark border-secondary text-secondary">Sem {index + 1}</span>
                            <input
                                type="number"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Enter GPA"
                                value={sem.gpa}
                                onChange={(e) => handleChange(sem.id, e.target.value)}
                            />
                            <button 
                                className="btn btn-outline-danger"
                                onClick={() => removeSemester(sem.id)}
                                disabled={semesters.length === 1}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex gap-2 mb-4">
                <button className="btn btn-secondary" onClick={addSemester}>
                    <FaPlus /> Add Semester
                </button>
                <button 
                    className="btn btn-primary" 
                    style={{ backgroundColor: 'var(--tool-primary)', borderColor: 'var(--tool-primary)' }}
                    onClick={calculate}
                >
                    Calculate CGPA
                </button>
                <button className="btn btn-outline-light" onClick={clear}>
                    Reset
                </button>
            </div>

            {result && (
                <div className="p-4 rounded text-center border mt-3" style={{ backgroundColor: 'var(--tool-primary-glass)', borderColor: 'var(--tool-primary)' }}>
                    <h2 className="mb-0 fw-bold text-white">{result}</h2>
                </div>
            )}
        </div>
    );
};
