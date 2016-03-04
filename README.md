# dbgcensus

A simple way to use the Daybreak Games Census API service

## Table of Contents

-[Installing](#installation)
-[Creating a new query](#create-query)
-[Returning data from the query](#get-data)
-[Setting global parameters](#create-query)
-[Defining a condition](#define-condition)
-[Setting a language](#set-language)
-[Show certain fields](#show-fields)
-[Hide certain fields](#hide-fields)
-[Set a limit for number of rows to return](#set-limit)
-[Set the starting row](#set-start)
-[Add a resolve](#add-resolve)
-[Join to another service](#join-service)
-[Group results (tree)](#set-tree)
-[Getting the url of the entire query string](#get-url)

## Installing

```
npm install dbgcensus --save
```

## Creating a new query

```js
var CensusQuery = require('dbgcensus').Query;
var query = new CensusQuery('character', 'ps2', 'example')
```

The dbgcensus.Query constructor accepts a service, optional serviceType, and optional serviceId. If a `globalNamespace` is not set than that argument becomes required. The acceptable namespaces can be found on the census.daybreakgames.com website. If a serviceId is not provided it defaults to the `globalKey` if one is set or 'example'.

## Returning data from the query

```js
query.get(function (error, data) {
  if (error) {
    // something went wrong!
  }

  //do something with data
});
```

The `data` variable represents the data of the collection list. Normally when a query is made with the census API it is returned like:

```js
{
  character_list: [
    {
      'character_id': 1234,
      //etc
    }
  ]
}
```

However dbgcensus returns just the data so the above becomes:

```js
[
  {
    'character_id': 1234,
    //etc
  }
]
```

## Setting global parameters

```js
var dbgcensus = require('dbgcensus');
dbgcensus.SetGlobalNamespace('ps2:v2');
dbgcensus.SetGlobalServiceKey('example');
```

## Defining a condition

```js
query.where('name.lower').equals('lampjaw');
```

The following operations and their equivalent syntax is below:

* `equals`: =
* `notEquals`: =!
* `isLessThan`: =<
* `isLessThanOrEquals`: =[
* `isGreaterThan`: =>
* `isGreaterThanOrEquals`: =]
* `startsWith`: =^
* `contains`: =*

## Setting a language

```js
query.setLanguage('en');
```

No language is set by default so you will receive all localized strings if available.

## Show certain fields

```js
query.showFields(['character_id', 'name', 'faction_id']);
```

## Hide certain fields

```js
query.hideFields(['currency', 'times']);
```

## Set a limit for number of rows to return

```js
query.setLimit(10);
```

## Set the starting row

```js
query.setStart(100);
```

## Add a resolve

```js
query.addResolve('world');
```

or for multiple resolves

```js
query.resolve(['world', 'outfit']);
```

## Join to another service

```js
var worldJoin = query.joinService('characters_world');
```

Join objects have the following methods:

* `isList(bool)`
* `isOuterJoin(bool)`
* `showFields(array)`: See the 'Show certain fields' section above
* `hideFields(array)`: See the 'Hide certain fields' section above
* `onField(string)`
* `toField(string)`
* `injectAt(string)`
* `where(string)`: See the 'Defining a condition' section above
* `joinService(string)`: Returns another join object for sub joining

## Group results (tree)

```js
var query = new CensusQuery('vehicle', 'ps2');
var vehicleTree = query.treeField('type_id');
```

Tree objects have the following methods:

* `isList(bool)`
* `groupPrefix(string)`
* `startField(string)`
* `treeField(string)`: Returns another tree object for sub grouping

## Getting the url of the entire query string

```js
var url = query.toUrl();
```
