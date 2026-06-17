import { Clock, Calendar } from 'lucide-react';

const ActivityFeed = ({ assignments }) => {
  // Sort assignments to ensure newest is first
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl h-full flex flex-col transition-all duration-300">
      <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-5 flex items-center gap-2">
        <Clock size={18} className="text-indigo-500 animate-pulse" />
        Activity Feed
      </h3>

      {sortedAssignments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <Calendar size={32} className="text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            No activity logged yet
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto max-h-[380px] pr-2 space-y-4 relative pl-3 border-l-2 border-slate-200/50 dark:border-slate-800/80">
          {sortedAssignments.slice(0, 10).map((assignment, index) => (
            <div key={assignment._id || index} className="relative group pl-5">
              
              {/* Timeline indicator node */}
              <span className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform duration-300 shadow-sm ${
                index === 0 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 ring-4 ring-indigo-500/20' 
                  : 'bg-slate-350 dark:bg-slate-600'
              }`}></span>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  {formatTime(assignment.uploadDate)}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate max-w-full group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-250">
                  {assignment.title}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Category: {assignment.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
