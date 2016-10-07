'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('css/app.css', electron.restart);
  gulp.watch('index.html', electron.restart);
  gulp.watch('renderer.js', electron.restart);

  // Reload renderer process
  //gulp.watch(['index.js', 'index.html'], electron.reload);
});
