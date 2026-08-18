![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p105-util-js)](https://github.com/PaulioRandall/p105-util-js/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p105-util-js)](https://github.com/PaulioRandall/p105-util-js/releases)

# P105: General JavaScript Utility Library

A personalised collection of JavaScript functions, classes, and constants.

**API Documentation:** _[/src](./src)_

**Made to be Plundered:** _Copy & paste_ files from _[/src](./src)_ into your project. Tests are written in [Jest](https://jestjs.io/) but should be easy to adapt or rewrite for whatever testing framework.

## `ArrayUtil`

Personalised collection of functions for manipulating and querying JavaScript arrays.

**Docs:** _[/src/ArrayUtil.js](./src/ArrayUtil.js)_

## `DirtyMap`

DirtyMap keeps a set of all keys for entries that are dirty, i.e. those that have been added, changed, deleted, or flagged by the user. It does not record what changes were made.

Implementation wise, it decorates the builtin JavaScript [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

**Docs:** _[/src/DirtyMap.js](./src/DirtyMap.js)_
