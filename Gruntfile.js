module.exports = function(grunt) {
 grunt.initConfig({
   pkg: grunt.file.readJSON('package.json'),

   simplemocha: {
     options: {
       reporter: 'spec'
     },
     all: { src: ['test/**/*.js'] }
   }
 });

 grunt.loadNpmTasks('grunt-simple-mocha');

 grunt.registerTask('test', ['simplemocha']);
 grunt.registerTask('default', ['test']);
};
