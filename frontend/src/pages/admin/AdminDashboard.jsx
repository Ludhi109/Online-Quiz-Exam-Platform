import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DashboardCards from '../../components/admin/ui/DashboardCards';
import ExamsTable from '../../components/admin/ui/ExamsTable';
import AddQuestionModal from '../../components/admin/AddQuestionModal';
import { LayoutDashboard, FileText, Users, Award, Search, Plus, Sparkles } from 'lucide-react';

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: '', duration: 30 });
  const [selectedExamForQuestion, setSelectedExamForQuestion] = useState(null);
  const [activeLayoutTab, setActiveLayoutTab] = useState('exams'); 
  const [activeSectionTab, setActiveSectionTab] = useState('management');
  const [isCreating, setIsCreating] = useState(false);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/exams`);
      setExams(res.data);
    } catch (error) {
      console.error("Failed to fetch exams", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/exams`, {
        title: newExam.title,
        duration: parseInt(newExam.duration)
      });
      setNewExam({ title: '', duration: 30 });
      setIsCreating(false);
      fetchExams();
    } catch (error) {
      console.error("Failed to create exam", error);
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/exams/${id}`);
        fetchExams();
      } catch (error) {
        console.error("Failed to delete exam", error);
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'exams', label: 'Manage Exams', icon: <FileText size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'results', label: 'Results', icon: <Award size={20} /> },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeTab={activeLayoutTab}
      setActiveTab={setActiveLayoutTab}
      sidebarTitle="Quiz Admin"
      headerTitle="Dashboard"
      headerSubtitle="Manage your exams and track student performance"
    >
      <div className="animate-fade-in pb-12">
        {/* Stats Cards Section */}
        <DashboardCards 
          totalExams={exams.length} 
          activeStudents="142" 
          averageScore="76%" 
        />

        {/* Visual Tabs Section */}
        <div className="flex border-b border-slate-800 mb-6">
          <button 
            onClick={() => setActiveSectionTab('management')}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${
              activeSectionTab === 'management' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exam Management
            {activeSectionTab === 'management' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] rounded-t-full"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveSectionTab('results')}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${
              activeSectionTab === 'results' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Student Results
            {activeSectionTab === 'results' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Content based on Tab */}
        {activeSectionTab === 'management' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold text-white">Manage Exams</h2>
              
              <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search exams..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 border border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Sparkles size={16} />
                    <span>Quick Seed</span>
                  </button>
                  <button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all active:scale-95 whitespace-nowrap border border-indigo-500/50"
                  >
                    <Plus size={18} />
                    <span>New Exam</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Create Exam Form (Conditional) */}
            {isCreating && (
              <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 animate-fade-in shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Create New Exam</h3>
                  <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>
                <form onSubmit={handleCreateExam} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Exam Title</label>
                    <input 
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                      placeholder="e.g. Midterm Mathematics" 
                      value={newExam.title} 
                      onChange={(e) => setNewExam({...newExam, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Duration (min)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                      placeholder="30" 
                      value={newExam.duration} 
                      onChange={(e) => setNewExam({...newExam, duration: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors h-[46px] shadow-lg shadow-indigo-500/20">
                      Save Exam
                    </button>
                  </div>
                </form>
              </div>
            )}

            <ExamsTable 
              exams={exams} 
              onAddQuestions={(exam) => setSelectedExamForQuestion(exam)}
              onDelete={handleDeleteExam}
            />
          </div>
        )}

        {activeSectionTab === 'results' && (
          <div className="flex flex-col items-center justify-center p-16 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed mt-4">
            <Award size={48} className="text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-300">Student Results</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md">Analytics and detailed performance metrics for your students will appear here soon.</p>
          </div>
        )}
      </div>

      {selectedExamForQuestion && (
        <AddQuestionModal 
          exam={selectedExamForQuestion} 
          onClose={() => setSelectedExamForQuestion(null)} 
          onQuestionAdded={fetchExams}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
