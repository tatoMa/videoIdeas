if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb://atzsmm:8pppmm@ds119578.mlab.com:19578/video-idea-traversy'
  }
} else
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
