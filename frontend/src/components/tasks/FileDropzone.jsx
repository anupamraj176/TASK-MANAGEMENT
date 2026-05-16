import { useRef } from 'react'
import { FileText, UploadCloud, X } from 'lucide-react'
import toast from 'react-hot-toast'

const formatSize = (size) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function FileDropzone({
  files,
  onChange,
  existingCount = 0,
  maxFiles = 3,
}) {
  const inputRef = useRef(null)
  const remainingSlots = Math.max(maxFiles - existingCount - files.length, 0)

  const handleFiles = (incoming) => {
    const allFiles = Array.from(incoming || [])
    const pdfFiles = allFiles.filter(
      (file) =>
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
    )

    if (pdfFiles.length !== allFiles.length) {
      toast.error('Only PDF files are allowed')
    }

    if (remainingSlots <= 0) {
      toast.error(`You can upload up to ${maxFiles} PDFs`)
      return
    }

    const allowed = pdfFiles.slice(0, remainingSlots)
    if (pdfFiles.length > remainingSlots) {
      toast.error(`Only ${remainingSlots} more file(s) allowed`)
    }

    onChange([...files, ...allowed])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    handleFiles(event.dataTransfer.files)
  }

  const handleBrowse = (event) => {
    handleFiles(event.target.files)
    event.target.value = ''
  }

  return (
    <div className="space-y-3">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pebble bg-cloud/40 px-4 py-6 text-center transition hover:border-iris"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud className="h-6 w-6 text-iris" />
        <p className="mt-2 text-sm font-medium text-midnight">
          Drag &amp; drop PDFs, or click to browse
        </p>
        <p className="mt-1 text-xs text-slate">
          Up to {maxFiles} files, PDF only
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleBrowse}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={`${file.name}-${file.size}`}
              className="flex items-center justify-between rounded-xl border border-pebble bg-white/80 px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm text-midnight">
                <FileText className="h-4 w-4 text-iris" />
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-slate">{formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => onChange(files.filter((item) => item !== file))}
                className="text-slate transition hover:text-coral"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileDropzone
