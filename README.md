# Prettier plugin better sort imports

A prettier plugin to sort import declarations by provided Regular Expression order.Inspired by [@trivago/prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports)

### Input

```javascript
import React, {
    FC,
    useEffect,
    useRef,
    ChangeEvent,
    KeyboardEvent,
} from 'react';
import { logger } from '@core/logger';
import { reduce, debounce } from 'lodash';
import { Message } from '../Message';
import { createServer } from '@server/node';
import { Alert } from '@ui/Alert';
import { repeat, filter, add } from '../utils';
import { initializeApp } from '@core/app';
import { Popup } from '@ui/Popup';
import { createConnection } from '@server/database';
```


### Output

```javascript
import { debounce, reduce } from 'lodash';
import React, {
    ChangeEvent,
    FC,
    KeyboardEvent,
    useEffect,
    useRef,
} from 'react';

import { createConnection } from '@server/database';
import { createServer } from '@server/node';

import { initializeApp } from '@core/app';
import { logger } from '@core/logger';

import { Alert } from '@ui/Alert';
import { Popup } from '@ui/Popup';

import { Message } from '../Message';
import { add, filter, repeat } from '../utils';
```

### Install

npm

```shell script
npm install --save-dev prettier-plugin-better-sort-imports
```

or, using yarn

```shell script
yarn add --dev prettier-plugin-better-sort-imports
```

### Usage

Add an order in prettier config file.

```javascript
module.exports = {
  "printWidth": 80,
  "tabWidth": 4,
  "trailingComma": "all",
  "singleQuote": true,
  "semi": true,
  "importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

### APIs

#### **`importOrder`**

**type**: `Array<string>`

A collection of Regular expressions in string format.

```javascript
"importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
```

_Default behavior:_ The plugin moves the third party imports to the top which are not part of the `importOrder` list.
To move the third party imports at desired place, you can use `<THIRD_PARTY_MODULES>` to assign third party imports to the appropriate position:

```javascript
"importOrder": ["^@core/(.*)$", "<THIRD_PARTY_MODULES>", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
```

## Notice

`<THIRD_PARTY_MODULES>` in `@trivago/prettier-plugin-sort-imports` are all third-party modules. When sorting, the dependencies will be sorted in alphabetical order, users can't specific sort orders for third packages, just like below:

```javascript
//	before sort
import React from 'react'
import { render } from 'react-dom'
import { v4 } from 'uuid'
import { message } from 'antd'
import { CoolModule } from 'coll-package'

//	sorted
import { message } from 'antd'
import { CoolModule } from 'coll-package'
import React from 'react'
import { render } from 'react-dom'
import { v4 } from 'uuid'
```

In `prettier-plugin-better-sort-imports`, users can specify the order of specific third-party packages, and `<THIRD_PARTY_MODULES>` will be sorted after the specified third-party packages, just like below:

```javascript
"importOrder": ["react", "react-dom", "<THIRD_PARTY_MODULES>", "eth."],
```

```javascript
//	before sort
import React from 'react'
import { render } from 'react-dom'
import { v4 } from 'uuid'
import { CoolModule } from 'coll-package'
import { message } from 'antd'

//	sorted
import React from 'react'
import { render } from 'react-dom'
import { message } from 'antd'
import { CoolModule } from 'coll-package'
import { v4 } from 'uuid'
```

#### `importOrderSeparation`

**type**: `boolean`

**default value**: `false`

A boolean value to enable or disable the new line separation
between sorted import declarations group. The separation takes place according to the `importOrder`.

```
"importOrderSeparation": true,
```

#### `importOrderSortSpecifiers`

**type**: `boolean`

**default value:** `false`

A boolean value to enable or disable sorting of the specifiers in an import declarations.

#### `importOrderGroupNamespaceSpecifiers`

**type**: `boolean`

**default value:** `false`

A boolean value to enable or disable sorting the namespace specifiers to the top of the import group.

#### `importOrderCaseInsensitive`

**type**: `boolean`

**default value**: `false`

A boolean value to enable case-insensitivity in the sorting algorithm
used to order imports within each match group.

For example, when false (or not specified):

```ecmascript 6
import ExampleView from './ExampleView';
import ExamplesList from './ExamplesList';
```

compared with `"importOrderCaseInsensitive": true`:

```ecmascript 6
import ExamplesList from './ExamplesList';
import ExampleView from './ExampleView';
```

#### `importOrderParserPlugins`

**type**: `Array<string>`

**default value**: `["typescript", "jsx"]`

Previously known as `experimentalBabelParserPluginsList`.

A collection of plugins for babel parser. The plugin passes this list to babel parser, so it can understand the syntaxes
used in the file being formatted. The plugin uses prettier itself to figure out the parser it needs to use but if that fails,
you can use this field to enforce the usage of the plugins' babel parser needs.

**To pass the plugins to babel parser**:

```
  "importOrderParserPlugins" : ["classProperties", "decorators-legacy"]
```

**To pass the options to the babel parser plugins**: Since prettier options are limited to string, you can pass plugins
with options as a JSON string of the plugin array:
`"[\"plugin-name\", { \"pluginOption\": true }]"`.

```
  "importOrderParserPlugins" : ["classProperties", "[\"decorators\", { \"decoratorsBeforeExport\": true }]"]
```

**To disable default plugins for babel parser, pass an empty array**:

```
importOrderParserPlugins: []
```

### How does import sort work ?

The plugin extracts the imports which are defined in `importOrder`. These imports are considered as _local imports_.
The imports which are not part of the `importOrder` is considered as _third party imports_.

After, the plugin sorts the _local imports_ and _third party imports_ using [natural sort algorithm](https://en.wikipedia.org/wiki/Natural_sort_order).

In the end, the plugin returns final imports with _third party imports_ on top and _local imports_ at the end.

The _third party imports_ position (it's top by default) can be overridden using the `<THIRD_PARTY_MODULES>` special word in the `importOrder`.

### FAQ / Troubleshooting

Having some trouble or an issue ? You can check [FAQ / Troubleshooting section](./docs/TROUBLESHOOTING.md).

### Compatibility

| Framework              | Supported                | Note                                             |
| ---------------------- | ------------------------ | ------------------------------------------------ |
| JS with ES Modules     | ✅ Everything            | -                                                |
| NodeJS with ES Modules | ✅ Everything            | -                                                |
| React                  | ✅ Everything            | -                                                |
| Angular                | ✅ Everything            | Supported through `importOrderParserPlugins` API |
| Vue                    | ⚠️ Soon to be supported. | Any contribution is welcome.                     |
| Svelte                 | ⚠️ Soon to be supported. | Any contribution is welcome.                     |

### Used by

Want to highlight your project or company ? Adding your project / company name will help plugin to gain attraction and contribution.
Feel free to make a Pull Request to add your project / company name.

-   [trivago](https://company.trivago.com)
-   ADD YOUR PROJECT / COMPANY NAME

### Contribution

For more information regarding contribution, please check the [Contributing Guidelines](./CONTRIBUTING.md). If you are trying to
debug some code in the plugin, check [Debugging Guidelines](./docs/DEBUG.md)

### Maintainers

| [Ayush Sharma](https://github.com/ayusharma)                             | [Behrang Yarahmadi](https://github.com/byara)                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| ![ayusharma](https://avatars2.githubusercontent.com/u/6918450?s=120&v=4) | ![@byara](https://avatars2.githubusercontent.com/u/6979966?s=120&v=4) |
| [@ayusharma\_](https://twitter.com/ayusharma_)                           | [@behrang_y](https://twitter.com/behrang_y)                           |

### Disclaimer

This plugin modifies the AST which is against the rules of prettier.
