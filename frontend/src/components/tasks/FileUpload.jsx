import { useState, useRef, useCallback } from 'react';

const MAX_FILES = 3;
const MAX_SIZE_MB = 10;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({ files, onChange, existingDocs = [], onRemoveExisting }) {
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);

  const totalCount = (files?.length || 0) + (existingDocs?.length || 0);

  const validate = (selectedFiles) => {
    const errs = [];
    const remaining = MAX_FILES - totalCount;

    if (selectedFiles.length > remaining) {
      errs.push(`You can only attach ${MAX_FILES} documents total. ${totalCount} already attached.`);
      return { valid: [], errs };
    }

    const valid = [];
    for (const file of selectedFiles) {
      if (file.type !== 'application/pdf') {
        errs.push(`"${file.name}" is not a PDF.`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errs.push(`"${file.name}" exceeds ${MAX_SIZE_MB}MB.`);
      } else {
        valid.push(file);
      }
    }
    return { valid, errs };
  };

  const handleFiles = useCallback(
    (selected) => {
      const { valid, errs } = validate(Array.from(selected));
      setErrors(errs);
      if (valid.length > 0) {
        onChange([...(files || []), ...valid]);
      }
    },
    [files, onChange, totalCount]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeNewFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    onChange(updated);
    setErrors([]);
  };

  const canAddMore = totalCount < MAX_FILES;

  return (
    <div className="space-y-3">
      {/* Existing docs */}
      {existingDocs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#8B8FA8] uppercase tracking-wide">Attached Documents</p>
          {existingDocs.map((doc) => (
            <div
              key={doc._id || doc.id}
              className="flex items-center justify-between px-3 py-2 bg-[#F5F6FA] rounded-lg border border-[#E2E4ED]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-[#EF4444] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                </svg>
                <span className="text-sm text-[#1A1A2E] truncate">{doc.filename || doc.name}</span>
              </div>
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(doc._id || doc.id)}
                  className="ml-2 text-[#8B8FA8] hover:text-[#EF4444] transition-colors"
                  aria-label="Remove document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New files */}
      {files && files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#8B8FA8] uppercase tracking-wide">New Files</p>
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 bg-[#EEF0FB] rounded-lg border border-[#5C6AC4]/20"
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-[#EF4444] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                </svg>
                <span className="text-sm text-[#1A1A2E] truncate">{file.name}</span>
                <span className="text-xs text-[#8B8FA8] shrink-0">{formatBytes(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="ml-2 text-[#8B8FA8] hover:text-[#EF4444] transition-colors"
                aria-label="Remove file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all
            ${dragging
              ? 'border-[#5C6AC4] bg-[#EEF0FB]'
              : 'border-[#E2E4ED] bg-[#F5F6FA] hover:border-[#5C6AC4] hover:bg-[#EEF0FB]'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-10 h-10 rounded-full bg-[#EEF0FB] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#5C6AC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#1A1A2E]">
              Drop PDFs here or <span className="text-[#5C6AC4]">browse</span>
            </p>
            <p className="text-xs text-[#8B8FA8] mt-0.5">
              PDF only · Max {MAX_SIZE_MB}MB each · {MAX_FILES - totalCount} slot{MAX_FILES - totalCount !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-[#EF4444] flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
