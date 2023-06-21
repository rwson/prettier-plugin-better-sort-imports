module.exports = {
    printWidth: 80,
    tabWidth: 4,
    trailingComma: 'all',
    singleQuote: true,
    jsxBracketSameLine: true,
    semi: true,
    base: __dirname,
    importOrder: [
        '^[vue]',
        '<THIRD_PARTY_MODULES>',
        '^[@/]',
        '[.vue]$',
        '^[./]'
    ],
    shouldSort: `function (filePath) { console.log(filePath); return true; }`,
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};
