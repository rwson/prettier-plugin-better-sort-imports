module.exports = {
    printWidth: 80,
    tabWidth: 4,
    trailingComma: 'all',
    singleQuote: true,
    jsxBracketSameLine: true,
    semi: true,
    plugins: [require('./lib/index.js')],
    importOrder: ['^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
