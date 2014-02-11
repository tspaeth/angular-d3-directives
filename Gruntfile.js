'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').concat(['gruntacular']).forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        name: 'angular-d3'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        connect: {
            livereload: {
                options: {
                    port: 9000,
                    // Change this to '0.0.0.0' to access the server from outside.
                    hostname: 'localhost',
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9000,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        testacular: {
            unit: {
                configFile: 'testacular.conf.js',
                singleRun: true
            }
        },
        concat: {
            // Done via index.html for correct order
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            js: '<%= yeoman.dist %>/{,*/}*.js',
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>'],
                patterns: {
                    js: [
                        [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp))/gm, 'Update the JS to reference our revved images']
                    ]
                }
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: '*.js',
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/<%= yeoman.name %>.min.js': [
                        '<%= yeoman.dist %>/<%= yeoman.name %>.js'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '**'
                        ]
                    }
                ]
            }
        }
    });

    grunt.renameTask('regarde', 'watch');
    // remove when mincss task is renamed
//    grunt.renameTask('mincss', 'cssmin');

    grunt.registerTask('server', [
        'clean:server',
        'coffee:dist',
        'compass:server',
        'livereload-start',
        'connect:livereload',
        'open',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'connect:test',
        'testacular'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concat',
        'copy',
        'uglify',
        'cdnify',
        'usemin',
        'ngmin'

    ]);

    grunt.registerTask('default', ['build']);
};
