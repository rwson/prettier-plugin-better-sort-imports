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
  "base": __dirname,
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

`<THIRD_PARTY_MODULES>` in `@trivago/prettier-plugin-sort-imports` are third-party modules. When sorting, the dependencies will be sorted alphabetically, and it is impossible to distinguish whether the import source is a third-party module (existing in package.json), and the user cannot specify a specific sort order for the third package, as shown below:

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

##### If you enable `formatOnSave` in your `Code Editor` and use `prettier-plugin-better-sort-imports` to sort module imports, then your `prettier` configuration file should contain `base` pointing to your project root directory，just like below

```javascript
//	.prettierrc
{
  //	SOME OPTIONS
  "base": "path/to/your-project-root-directory"
}

//	prettier.config.js
module.exports = {
  //	SOME OPTIONS
  base: __dirname
};

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

```javascript
import ExampleView from './ExampleView';
import ExamplesList from './ExamplesList';
```

compared with `"importOrderCaseInsensitive": true`:

```javascript
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

```javascript
  "importOrderParserPlugins" : ["classProperties", "decorators-legacy"]
```

**To pass the options to the babel parser plugins**: Since prettier options are limited to string, you can pass plugins
with options as a JSON string of the plugin array:
`"[\"plugin-name\", { \"pluginOption\": true }]"`.

```javascript
  "importOrderParserPlugins" : ["classProperties", "["decorators", { "decoratorsBeforeExport": true }]"]
```

**To disable default plugins for babel parser, pass an empty array**:

```javascript
importOrderParserPlugins: []
```

### Compatibility

| Framework              | Supported                | Note                                             |
| ---------------------- | ------------------------ | ------------------------------------------------ |
| JS with ES Modules     | ✅ Everything            | -                                                |
| NodeJS with ES Modules | ✅ Everything            | -                                                |
| React                  | ✅ Everything            | -                                                |
| Angular                | ✅ Everything            | Supported through `importOrderParserPlugins` API |
| Vue                    | ✅ Everything            | @vue/compiler-sfc is required                    |

### Disclaimer

This plugin modifies the AST which is against the rules of prettier.
