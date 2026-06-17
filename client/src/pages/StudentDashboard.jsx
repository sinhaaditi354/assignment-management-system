import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ActivityFeed from '../components/ActivityFeed';
import FilePreviewModal from '../components/FilePreviewModal';
import api from '../utils/api';
import { 
  Search, Download, Eye, Calendar, Tag, FileType, 
  Sparkles, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Preview Modal States
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState({ url: '', type: '', title: '' });

  // Fetch Assignments on Mount
  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data.assignments);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load assignments');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Listen for socket events
  useEffect(() => {
    if (socket) {
      socket.on('assignmentUploaded', (newAssignment) => {
        // Prevent duplicate appending
        setAssignments((prev) => {
          if (prev.some(a => a._id === newAssignment._id)) return prev;
          return [newAssignment, ...prev];
        });

        // Trigger real-time toast
        toast.custom((t) => (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 glass-card p-4 gap-3 border-l-4 border-blue-500`}>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles size={16} className="text-blue-500 animate-bounce" />
                New Assignment Uploaded!
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                "{newAssignment.title}" is now available in {newAssignment.category}.
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-xs font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider self-center"
            >
              Dismiss
            </button>
          </div>
        ), { duration: 5000 });
      });
    }

    return () => {
      if (socket) {
        socket.off('assignmentUploaded');
      }
    };
  }, [socket]);

  // Helper to check if assignment is uploaded within 24 hours
  const isNewAssignment = (uploadDate) => {
    const hours = (Date.now() - new Date(uploadDate).getTime()) / (1000 * 60 * 60);
    return hours < 24;
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Open Preview Modal
  const handlePreview = (assignment) => {
    setPreviewFile({
      url: assignment.fileUrl,
      type: assignment.fileType,
      title: assignment.title,
    });
    setPreviewOpen(true);
  };

  // Filter logic
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'All' || 
      assignment.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Programming', 'Web Development', 'Database', 'Aptitude', 'Other'];

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Programming': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20';
      case 'Web Development': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'Database': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20';
      case 'Aptitude': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 dark:bg-slate-500/20';
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30';
      case 'DOCX': return 'bg-blue-600/10 text-blue-600 dark:text-blue-450 border-blue-200 dark:border-blue-900/30';
      default: return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/30';
    }
  };

  const backendUrl = 'http://localhost:5000';

  return (
    <div className="min-h-screen premium-bg transition-colors duration-300 relative overflow-hidden">
      {/* Floating gradient blur blobs */}
      <div className="absolute top-12 left-12 w-[350px] h-[350px] bg-blue-400/15 dark:bg-blue-600/20 rounded-full blur-[110px] animate-float-1 pointer-events-none"></div>
      <div className="absolute top-1/3 right-12 w-[400px] h-[400px] bg-purple-400/15 dark:bg-purple-600/20 rounded-full blur-[120px] animate-float-2 pointer-events-none"></div>
      <div className="absolute bottom-12 left-1/3 w-[300px] h-[300px] bg-indigo-400/12 dark:bg-indigo-600/15 rounded-full blur-[90px] animate-float-3 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-pink-400/10 dark:bg-pink-600/12 rounded-full blur-[80px] animate-float-4 pointer-events-none"></div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 animate-fade-in relative z-10">
        
        {/* Banner Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Hello, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
              Welcome back, Student 👩‍🎓
            </p>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="glass-card p-5 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description or tag..."
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-medium text-sm"
            />
          </div>

          {/* Category Badges Filter list */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] scale-105'
                    : 'glass text-slate-600 dark:text-slate-350 border-white/20 dark:border-slate-800/80 hover:bg-white/30 dark:hover:bg-slate-800/50 hover:scale-105 active:scale-95'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Assignment Grid */}
          <div className="lg:col-span-2">
            
            {filteredAssignments.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl">
                <Search size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  No assignments found
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Try adjusting your keywords or category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAssignments.map((assignment) => (
                  <div 
                    key={assignment._id}
                    className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between group relative overflow-hidden"
                  >
                    
                    {/* Animated Glow on Card Border on Hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-blue-500/20 rounded-2xl pointer-events-none transition-colors duration-200"></div>

                    {/* Top Badges & Meta */}
                    <div className="flex items-center justify-between mb-4">
                      
                      {/* Left: Category Badge */}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${getCategoryColor(assignment.category)}`}>
                        {assignment.category}
                      </span>
                      
                      {/* Right: NEW badge if uploaded within 24h */}
                      {isNewAssignment(assignment.uploadDate) && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm animate-pulse">
                          New
                        </span>
                      )}

                    </div>

                    {/* Text Details */}
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 dark:text-slate-100 text-base mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {assignment.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-5 line-clamp-3">
                        {assignment.description}
                      </p>
                    </div>

                    {/* Bottom File Metadata & Buttons */}
                    <div className="border-t border-slate-200/55 dark:border-slate-800/55 pt-4 mt-auto">
                      
                      <div className="flex items-center justify-between mb-4 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {formatDate(assignment.uploadDate)}
                        </span>
                        
                        {/* File Extension Type Badge */}
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getFileTypeColor(assignment.fileType)}`}>
                          {assignment.fileType}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        
                        {/* View/Preview */}
                        <button
                          onClick={() => handlePreview(assignment)}
                          className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-102 cursor-pointer btn-glow"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                        
                        {/* Direct Download */}
                        <a
                          href={`${backendUrl}${assignment.fileUrl}`}
                          download
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer text-center btn-glow"
                        >
                          <Download size={14} />
                          Download
                        </a>

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
            
          </div>

          {/* Activity Feed Column */}
          <div className="lg:col-span-1">
            <ActivityFeed assignments={assignments} />
          </div>

        </div>

      </main>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fileUrl={previewFile.url}
        fileType={previewFile.type}
        title={previewFile.title}
      />
    </div>
  );
};

export default StudentDashboard;
