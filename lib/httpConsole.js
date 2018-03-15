const counter = require('request-counter')

module.exports = require('tracer').colorConsole({
  preprocess: (data) => {
    data.title = counter.current()
  }
})
