
module.exports = {
    root: true,
    extends: 'usecases/usecase/nodejs',
    env: {
        jest: true,
        node: true,
    },
    parserOptions: {

        sourceType: 'module',
    },
    rules: {
        'no-console': 'off',
        strict: ['error', 'global'],
    },
}

