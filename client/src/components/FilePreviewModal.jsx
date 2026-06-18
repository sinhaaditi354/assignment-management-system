import { useEffect } from 'react';
import { X, FileText, Download, EyeOff } from 'lucide-react';

const FilePreviewModal = ({ isOpen, onClose, fileUrl, fileType, title }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const backendUrl = 'https://assignment-management-system-gbkg.onrender.com';
  const fullUrl = `${backendUrl}${fileUrl}`;
  const isImage = ['PNG', 'JPG', 'JPEG'].includes(fileType);
  const isPdf = fileType === 'PDF';
  const isDocx = fileType === 'DOCX';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="glass-card animate-fade-in relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform scale-100 z-10">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200/55 dark:border-slate-800/55">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-lg text-white font-bold text-xs uppercase ${isPdf ? 'bg-rose-500 shadow-sm' : isDocx ? 'bg-blue-600 shadow-sm' : 'bg-emerald-500 shadow-sm'
              }`}>
              {fileType}
            </span>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg truncate max-w-[50vw]">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-250 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:scale-105 active:scale-95 transition-all duration-350"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-950/5 dark:bg-slate-950/20 p-4 md:p-6 overflow-auto flex items-center justify-center min-h-[350px]">
          {isImage && (
            <img
              src={fullUrl}
              alt={title}
              className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md border border-slate-200/60 dark:border-slate-850"
            />
          )}

          {isPdf && (
            <iframe
              src={fullUrl}
              title={title}
              className="w-full h-[60vh] rounded-xl border border-slate-200 dark:border-slate-800 shadow"
            />
          )}

          {isDocx && (
            <div className="text-center py-12 px-6 flex flex-col items-center max-w-md">
              <div className="p-5 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full mb-4 shadow-inner">
                <FileText size={48} className="animate-pulse" />
              </div>
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">
                DOCX Document Preview Unavailable
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Web browsers do not support direct rendering of Microsoft Word files. You can download the file to view it on your device.
              </p>
              <a
                href={fullUrl}
                download
                className="btn-glow flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-98"
              >
                <Download size={18} />
                Download Document
              </a>
            </div>
          )}

          {!isImage && !isPdf && !isDocx && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <EyeOff size={40} className="mx-auto mb-2 text-slate-455" />
              <p>Preview not available for this file type.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-slate-200/55 dark:border-slate-800/55">
          <button
            onClick={onClose}
            className="px-4.5 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-300 hover:scale-102 active:scale-98"
          >
            Close
          </button>
          {!isDocx && (
            <a
              href={fullUrl}
              download
              className="btn-glow flex items-center gap-2 px-4.5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md text-sm transition-all duration-300 active:scale-98"
            >
              <Download size={16} />
              Download
            </a>
          )}
        </div>

      </div>
    </div>
  );
};

export default FilePreviewModal;
