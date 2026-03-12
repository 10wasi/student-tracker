import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Brain, BookOpen, GraduationCap, TrendingUp, Search } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [insights, setInsights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  
  // Combine fetching logic
  const fetchData = async () => {
    try {
      const [studentsRes, insightsRes] = await Promise.all([
        axios.get(`${API_BASE}/students`),
        axios.get(`${API_BASE}/insights`)
      ]);
      
      // Need to fetch grades for each student to calculate averages and prepare chart data
      const studentsWithGrades = await Promise.all(
        studentsRes.data.map(async (student) => {
          const gradesRes = await axios.get(`${API_BASE}/grades/${student.id}`);
          const grades = gradesRes.data;
          const avgGrid = grades.length > 0 
            ? grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length 
            : 0;
          return { ...student, grades, average: avgGrid.toFixed(1) };
        })
      );
      
      setStudents(studentsWithGrades);
      setInsights(insightsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // 5-second auto-refresh
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.courses.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Prepare chart data based on average grades
  const chartData = filteredStudents.map(s => ({
    name: s.name,
    Average: parseFloat(s.average)
  }));


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-gray-900">EduTrack AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsStudentModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                + Add Student
              </button>
              <button 
                onClick={() => setIsGradeModalOpen(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition"
              >
                + Add Grade
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Section: Quick Stats & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* AI Insights Panel */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-900">AI Performance Insights</h2>
            </div>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {insights.length === 0 ? (
                <p className="text-gray-500 text-sm">No critical insights at this time. All students are performing well.</p>
              ) : (
                insights.map((insight, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 border-l-4 border-l-orange-400">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{insight.student_name} Needs Attention</h4>
                        <ul className="mt-1 space-y-1">
                          {insight.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-gray-600 leading-relaxed">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Class Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-emerald-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-900">Class Overview</h2>
            </div>
            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 font-medium">Auto-Refreshes</p>
                  <div className="flex items-center mt-1">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    <p className="text-sm text-emerald-600 font-medium">Live (Server Sync)</p>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Charts & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
                Student Roster
              </h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or course..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
              <div className="grid gap-4">
                {filteredStudents.map(student => (
                  <div key={student.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {student.courses.map(course => (
                            <span key={course} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center ${
                        parseFloat(student.average) >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                         Avg: {student.average}%
                      </div>
                    </div>
                    
                    {/* Individual Grades */}
                    {student.grades.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Recent Grades</p>
                        <div className="flex flex-wrap gap-3">
                          {student.grades.map((grade, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <span className="text-gray-600 mr-1">{grade.course}:</span>
                              <span className={`font-semibold ${grade.score >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {grade.score}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                   <p className="text-center text-gray-500 py-8">No students match your filter.</p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-[500px] flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
               Trend Analysis
            </h2>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                     cursor={{ fill: '#F3F4F6' }}
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="Average" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>

      {/* Modals are kept minimal for this MVP, assuming user only reads logic, or we inject forms here */}
      {isStudentModalOpen && (
        <StudentModal 
          onClose={() => setIsStudentModalOpen(false)} 
          onSuccess={fetchData} 
        />
      )}
      {isGradeModalOpen && (
        <GradeModal 
          students={students} 
          onClose={() => setIsGradeModalOpen(false)} 
          onSuccess={fetchData} 
        />
      )}

    </div>
  );
};

// Extracted Modals for clean code
const StudentModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [courses, setCourses] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const coursesList = courses.split(',').map(c => c.trim()).filter(Boolean);
    try {
      await axios.post(`${API_BASE}/students`, { name, courses: coursesList });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Courses (comma separated)</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="Math, Science" value={courses} onChange={e => setCourses(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Save Student</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const GradeModal = ({ students, onClose, onSuccess }) => {
  const [studentId, setStudentId] = useState(students.length > 0 ? students[0].id : '');
  const [course, setCourse] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/grades`, { student_id: studentId, course, score: parseFloat(score) });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add Grade Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student</label>
            <select required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" value={studentId} onChange={e => setStudentId(e.target.value)}>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" value={course} onChange={e => setCourse(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Score (%)</label>
            <input required type="number" min="0" max="100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" value={score} onChange={e => setScore(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md">Save Grade</button>
          </div>
        </form>
      </div>
    </div>
  )
}


export default Dashboard;
