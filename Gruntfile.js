module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        opt: {
            src : './src',
            dest: './build'
        },

        concat: {
            node: {
                src : [
                    '<%= opt.src %>/header.snippet',
                    '<%= opt.src %>/util.js',
                    '<%= opt.src %>/node.js',
                    '<%= opt.src %>/selector.js',
                    '<%= opt.src %>/class.js',
                    '<%= opt.src %>/attr.js',
                    '<%= opt.src %>/style.js',
                    '<%= opt.src %>/traversal.js',
                    '<%= opt.src %>/insertion.js',
                    '<%= opt.src %>/offset.js',
                    '<%= opt.src %>/create.js',
                    '<%= opt.src %>/output.js',
                    '<%= opt.src %>/footer.snippet'
                ],
                dest: '<%= opt.dest %>/node.js'
            }
        },

        uglify: {
            node: {
                src : '<%= opt.dest %>/node.js',
                dest: '<%= opt.dest %>/node-min.js'
            }
        },

        docco: {
            node: {
                src: ['build/node.js'],
                options: {
                    output: 'docs/'
                }
            }
        },

        watch: {
            node: {
                files: ['<%= opt.src %>/*.js'],
                tasks: ['concat', 'uglify', 'docco']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'docco', 'watch']);

};