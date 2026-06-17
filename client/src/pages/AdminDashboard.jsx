import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ActivityFeed from '../components/ActivityFeed';
import api from '../utils/api';
import { 
  FileUp, Files, FileText, Image, 
  BookOpen, Plus, Percent, CheckCircle, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pdf: 0, docx: 0, image: 0 });
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [file, setFile] = useState(null);
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch Assignments & Stats on Mount
  const fetchData = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data.assignments);
      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load assignments data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen for socket events
  useEffect(() => {
    if (socket) {
      socket.on('assignmentUploaded', (newAssignment) => {
        // Prevent duplicate appending if this client initiated it
        setAssignments((prev) => {
          if (prev.some(a => a._id === newAssignment._id)) return prev;
          return [newAssignment, ...prev];
        });

        // Update statistics dynamically
        setStats((prev) => {
          const isPdf = newAssignment.fileType === 'PDF';
          const isDocx = newAssignment.fileType === 'DOCX';
          const isImage = ['PNG', 'JPG', 'JPEG'].includes(newAssignment.fileType);

          return {
            total: prev.total + 1,
            pdf: prev.pdf + (isPdf ? 1 : 0),
            docx: prev.docx + (isDocx ? 1 : 0),
            image: prev.image + (isImage ? 1 : 0),
          };
        });

        toast.success(`New Assignment Uploaded: "${newAssignment.title}"`);
      });
    }

    return () => {
      if (socket) {
        socket.off('assignmentUploaded');
      }
    };
  }, [socket]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      const allowed = ['pdf', 'docx', 'png', 'jpg', 'jpeg'];
      
      if (!allowed.includes(ext)) {
        toast.error('Supported formats: PDF, DOCX, PNG, JPG, JPEG');
        setFile(null);
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !file) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('file', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await api.post('/assignments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Programming');
      setFile(null);
      // Reset input element
      const fileInput = document.getElementById('file-upload-input');
      if (fileInput) fileInput.value = '';

      // Update state manually if socket event wasn't already triggered
      setAssignments((prev) => {
        if (prev.some(a => a._id === response.data._id)) return prev;
        return [response.data, ...prev];
      });

      toast.success('Assignment uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upload assignment');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
              Hello, {user?.name || 'Admin'} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
              Welcome back, Admin ⚙️
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl glow-blue flex items-center gap-4 cursor-pointer">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <Files size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Assignments
              </span>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {stats.total}
              </h4>
            </div>
          </div>

          {/* PDFs */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl glow-blue flex items-center gap-4 cursor-pointer">
            <div className="p-3 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                PDF Documents
              </span>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {stats.pdf}
              </h4>
            </div>
          </div>

          {/* DOCX */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl glow-blue flex items-center gap-4 cursor-pointer">
            <div className="p-3 bg-blue-600/10 dark:bg-blue-650/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Word Files
              </span>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {stats.docx}
              </h4>
            </div>
          </div>

          {/* Images */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl glow-blue flex items-center gap-4 cursor-pointer">
            <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Image size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Image Uploads
              </span>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {stats.image}
              </h4>
            </div>
          </div>

        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Form Column */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
              
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-6 flex items-center gap-2">
                  <FileUp size={20} className="text-blue-500" />
                  Upload Assignment
                </h3>

                <form onSubmit={handleUpload} className="space-y-6">
                  
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. React hooks implementation"
                      className="glass-input w-full px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none transition-all font-medium text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detail tasks, goals and guidelines for this assignment..."
                      className="glass-input w-full px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none transition-all font-medium text-sm resize-none"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="glass-input w-full px-4 py-3 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none transition-all font-medium text-sm"
                      >
                        <option value="Programming" className="dark:bg-slate-900">Programming</option>
                        <option value="Web Development" className="dark:bg-slate-900">Web Development</option>
                        <option value="Database" className="dark:bg-slate-900">Database</option>
                        <option value="Aptitude" className="dark:bg-slate-900">Aptitude</option>
                        <option value="Other" className="dark:bg-slate-900">Other</option>
                      </select>
                    </div>

                    {/* File Upload input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        Attachment
                      </label>
                      <div className="relative">
                        <input
                          id="file-upload-input"
                          type="file"
                          required
                          onChange={handleFileChange}
                          className="glass-input w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-blue-500/10 file:text-blue-600 dark:file:text-blue-400 dark:file:bg-blue-500/20 hover:file:bg-blue-500/20 file:transition-all file:cursor-pointer cursor-pointer rounded-xl p-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Percent size={14} className="animate-spin text-blue-500" />
                          Uploading File...
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer text-sm uppercase tracking-wider btn-glow"
                  >
                    <Plus size={18} />
                    Publish Assignment
                  </button>

                </form>
              </div>

            </div>
          </div>

          {/* Activity Feed Column */}
          <div className="lg:col-span-1">
            <ActivityFeed assignments={assignments} />
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
