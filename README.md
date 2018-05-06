
Chunking
========

Simple Task Chunking

<p/>
<img src="https://nodei.co/npm/chunking.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/chunking.png" alt=""/>

About
-----

Chunking is a very small JavaScript library, providing the capability
to chunk (aka rate limit or throttle) method calls by first absorbing
arguments to a function up to a certain amount of time and then finally
emitting the arguments to an underlying function.

Installation
------------

```shell
$ npm install chunking
```

Usage
-----

```js
const Chunking = require("chunking")
const expect   = require("chai").expect

const receive = (items) => {
    expect(items).to.be.deep.equal([ "foo", "bar", "baz", "quux" ])
    console.log(items)
}

let notify = new Chunking({
    reset:  (ctx)        => { ctx.items = [] },
    absorb: (ctx, items) => { items.forEach((item) => ctx.items.push(item)) },
    emit:   (ctx)        => { receive(ctx.items) },
    delay:  2 * 1000
})

notify([ "foo", "bar" ])
notify([ "baz" ])
notify([ "quux" ])
```

License
-------

Copyright (c) 2018 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

