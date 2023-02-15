import multer from 'multer'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  })

  const fileFilter = (req,file,cb): void => {
    if (file.mimtype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    cb(null, false)
  }


export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    }
    // ,
    // fileFilter
})


// const upload = multer.single({ storage: storage })

export default upload