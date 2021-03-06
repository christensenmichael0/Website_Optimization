module.exports = function(grunt) {
    grunt.initConfig({
        
        // clean
        clean: ['index.html', 'dist/*'],
        // Copy all the css files from src to dist
        
        copy: {
            dist: {
                cwd: 'src/',
                expand: true,
                src: '**/*.{css,png,PNG,jpg,jpeg,JPG,gif,GIF}',
                dest: 'dist/'
            }
        },
        
        // Inline CSS and JS
        inline: {
            target1: {
                options: {
                    inlineTagAttributes: {
                        /*js: 'data-inlined="true"',*/
                        css: 'data-inlined="true"'
                    },
                    cssmin: true,
                    uglify: true
                },
                src: 'index_pretty.html',
                dest: 'index.html'
            },
            target2: {
                options: {
                    inlineTagAttributes: {
                        /*js: 'data-inlined="true"',*/
                        css: 'data-inlined="true"'
                    },
                    cssmin: true,
                    uglify: true
                },
                src: 'src/views/pizza.html',
                dest: 'dist/views/pizza.html'
            }
        },
        //uglify some JS seperately
        uglify: {
            js: {
                files: {
                    'dist/views/js/main.min.js': 'src/views/js/main.js',
                    'dist/js/perfmatters.min.js': 'src/js/perfmatters.js'
                }
            }
        },
        // Minify html files
        htmlmin: { // Task
            main_file: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'index.html' : 'index.html' // 'destination': 'source'
                }
            },
            other_files: { // Another target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['**/*.html'],
                    dest: 'dist'
                }]
            }
        },
        // Responsive Image
        responsive_images: {
            homePageImages: {
                options: {
                    sizes: [{
                            width: 100,
                            suffix: 'tiny'
                        },
                        {
                            width: 400,
                            suffix: 'small'
                        }, {
                            width: 800,
                            suffix: 'medium'
                        }, {
                            width: 1200,
                            suffix: 'large'
                        },
                        {
                            width: 2000,
                            suffix: 'superlarge'
                        }
                    ]
                },
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'src/views/images', // Src matches are relative to this path.
                    src: ['*.jpg'], // Actual pattern(s) to match.
                    dest: 'dist/views/images', // Destination path prefix.
                }]
            }
        },
        // Minify images (only in dist folder)
        tinyimg: {
            dynamic: { // target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'dist/', // Src matches are relative to this path
                    src: ['**/*.{png,PNG,jpg,JPG,JPEG,gif,GIF}'], // Actual patterns to match
                    dest: 'dist/' // Destination path prefix
                }]
            }
        }
    });
    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-inline');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-tinyimg');
    // Default tasks.
    
    grunt.registerTask('default', ['clean', 'copy', 'inline', 'uglify','htmlmin', 'responsive_images', 'tinyimg']);
};