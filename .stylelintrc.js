module.exports = {
    extends: 'stylelint-config-standard',
    rules: {
        'color-hex-length': 'short',
        'no-empty-source': null,
    },
    ignoreFiles: ['node_modules/**/*.css', 'dist/**/*.css'],

}

