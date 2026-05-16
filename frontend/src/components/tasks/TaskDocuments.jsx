import { useState } from 'react';
import { taskService } from '../../services/taskService';

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function TaskDocuments({ taskId, documents = [] }) {
  const [downloading, setDownloading] = useState(null);

  const handleView = (doc) => {
    // Open Cloudinary/S3 URL directly in new tab
    window.open(doc.url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = async (doc) => {
    setDownloading(doc._id || doc.id);
    try {
      const response = await taskService.downloadDocument(taskId, doc._id || doc.id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.filename || doc.name || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // If download endpoint fails, fall back to direct URL
      window.open(doc.url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(null);
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#8B8FA8] py-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        No documents attached
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => {
        const docId = doc._id || doc.id;
        const isDownloading = downloading === docId;
        return (
          <div
            key={docId}
            className="flex items-center gap-3 px-4 py-3 bg-[#F5F6FA] border border-[#E2E4ED] rounded-xl
              hover:border-[#5C6AC4]/30 hover:bg-[#EEF0FB] transition-all group"
          >
            {/* PDF icon */}
            <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#EF4444]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
              </svg>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A2E] truncate">
                {doc.filename || doc.name || 'Document'}
              </p>
              {doc.size && (
                <p className="text-xs text-[#8B8FA8]">{formatBytes(doc.size)}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* View */}
              <button
                onClick={() => handleView(doc)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  text-[#5C6AC4] hover:bg-[#5C6AC4] hover:text-white transition-all"
                title="Open in new tab"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>

              {/* Download */}
              <button
                onClick={() => handleDownload(doc)}
                disabled={isDownloading}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  text-[#8B8FA8] hover:text-[#1A1A2E] hover:bg-[#E2E4ED] transition-all disabled:opacity-60"
                title="Download"
              >
                {isDownloading ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                {isDownloading ? '' : 'Download'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
