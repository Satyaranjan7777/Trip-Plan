const multer = require('multer')
const fs = require('fs')
const path = require('path')

const getUploadDir = () => {
  // Prefer an explicit absolute/relative path from env; fallback to ./uploads
  const dir = process.env.UPLOAD_DIR || 'uploads'
  // multer expects a path relative to process cwd or absolute; we normalize to absolute
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = getUploadDir()
      fs.mkdirSync(uploadDir, { recursive: true })
      cb(null, uploadDir)
    } catch (err) {
      cb(err)
    }
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'bin'
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${file.fieldname}-${unique}.${ext}`)
  },
})

const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png'])

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Only PDF, JPG, and PNG files are allowed'))
    }
    return cb(null, true)
  },
})

// Expects field name: file
const uploadSingleFile = upload.single('file')

module.exports = { uploadSingleFile }

