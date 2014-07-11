module.exports =
    files:
        src: ['<%= ng.rootFolder %>/**/*.coffee']
    options:
        'indentation':
            value: 4
            level: 'warn'
        'no_trailing_whitespace':
            level: 'ignore'
        'max_line_length':
            velue: 120
            level: 'warn'