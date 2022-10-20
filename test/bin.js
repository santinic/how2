const { exec } = require('child_process')
const { assert } = require('chai')

describe('bin', function () {
  this.timeout(10000)
  describe('ai', () => {
    it('decompress tar.gz', (done) => {
      exec('./bin/how2 decompress tar.gz', (error, stdout, stderr) => {
        assert.isNull(error)
        assert.equal(stderr, '')
        assert.include(stdout, 'tar')
        assert.include(stdout, 'x')
        assert.include(stdout, 'tar.gz')
        done()
      })
    })
    it('install rust dependencies', (done) => {
      exec('./bin/how2 install rust dependencies and compile main.rs', (error, stout, stderr) => {
        assert.isNull(error)
        assert.include(stout, 'cargo')
        done()
      })
    })
  })
  describe('stackoverflow', function () {
    this.timeout(10000)
    it('create symbolic link -s -p', (done) => {
      exec('./bin/how2 create symbolic link -s -p', (error, stdout, stderr) => {
        assert.isNull(error)
        console.log(stdout)
        assert.include(stdout, 'ln -s')
        done()
      })
    })
    it('-s unzip tar.gz', (done) => {
      exec('./bin/how2 -s -p unzip tar.gz', (error, stdout, stderr) => {
        assert.isNull(error)
        console.log(stdout)
        assert.include(stdout, 'tar')
        assert.include(stdout, 'x')
        assert.include(stdout, 'tar.gz')
        done()
      })
    })
    it('convert mov to mp4 with ffmpeg  -s', (done) => {
      exec('./bin/how2 -s -p convert mov to mp4 with ffmpeg', (error, stdout, stderr) => {
        assert.isNull(error)
        console.log(stdout)
        assert.include(stdout, 'ffmpeg')
        done()
      })
    })
  })
})
