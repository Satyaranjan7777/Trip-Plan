import { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const CloudUploadIcon = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 16v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M16 11l-4-4-4 4" />
    <path d="M12 7v12" />
    <path d="M21 16v0" />
  </svg>
)


const accept = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

const UploadBox = ({ onUpload, loading = false }) => {

  const [fileName, setFileName] = useState('')

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles?.[0]
      if (!file) return
      setFileName(file.name || '')
      if (onUpload) onUpload(file)
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    disabled: loading,
  })


  const helperText = useMemo(() => {
    if (loading) return 'Generating your itinerary...'
    return isDragActive ? 'Drop your booking file here' : 'Drag & drop your booking file here'
  }, [isDragActive, loading])

  return (
    <div
      {...getRootProps()}
      className={
        'group cursor-pointer rounded-2xl border-2 border-dashed bg-white/80 p-6 transition-all duration-300 ' +
        'backdrop-blur hover:shadow-xl hover:border-indigo-300 ' +
        (loading ? 'cursor-not-allowed opacity-80' : 'border-indigo-200')
      }
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-sm">
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <CloudUploadIcon className="h-6 w-6" />
          )}

        </div>

        <div className="mt-4 text-sm font-semibold text-slate-900">{helperText}</div>
        <div className="mt-2 text-xs text-slate-600">Supports PDF, JPG, PNG</div>

        {fileName ? <div className="mt-3 w-full truncate text-xs font-medium text-indigo-700">{fileName}</div> : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              if (loading) return
              open()
            }}
            disabled={loading}

            className={
              'rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 ' +
              (loading ? 'opacity-70' : 'active:scale-[0.99]')
            }
          >
            Choose File
          </button>

          <div className="text-xs text-slate-500">
            {loading ? null : (
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700 ring-1 ring-indigo-100">
                Drag & drop supported
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="mt-4 flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <div className="text-sm font-medium text-slate-800">Generating your itinerary...</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default UploadBox



