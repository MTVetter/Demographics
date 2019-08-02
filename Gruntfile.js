module.exports = function(grunt) {

    //Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: ["Gruntfile.js", "src/js/*.js"]
        },
        uglify: {
            options: {
                banner: "/*\n <%= pkg.name %><%= grunt.template.today('yyyy-mm-dd') %> \n*/\n"
            },
            build: {
                files: {
                    "dist/js/main.min.js": ["dist/js/main.js"]
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ["@babel/preset-env"]
            },
            dist: {
                files: {
                    "dist/js/main.js": "src/js/main.js"
                }
            }
        },
        clean: {
            build: {
                src: ["dist/"]
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: "src",
                src: "**",
                dest: "dist/"
            }
        },
        watch: {
            scripts: {
                files: ["src/js/main.js"],
                tasks: ["babel", "uglify"]
            }
        }
    });

    //Load the Grunt plugins.
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");

    //Register the default tasks.
    grunt.registerTask("default", ["clean", "copy", "babel", "uglify", "watch"]);
};