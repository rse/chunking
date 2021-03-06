/*
**  Chunking -- Simple Task Chunking
**  Copyright (c) 2018-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  the API function  */
const chunking = (options = {}) => {
    /*  determine options  */
    options = Object.assign({}, {
        reset:  (ctx)          => { ctx.chunks = [] },
        absorb: (ctx, ...args) => { ctx.chunks = ctx.chunks.concat(args) },
        emit:   null,
        delay:  100
    }, options)

    /*  sanity check usage  */
    if (options.emit === null)
        throw new Error("at least option \"emit\" has to be given")

    /*  the internal state  */
    let ctx       = {}
    let timer     = null
    let cancelled = false
    let absorbed  = false

    /*  the chunking API function  */
    const fn = function (...args) {
        /*  short-circuit processing  */
        if (cancelled)
            return

        /*  absorb the arguments  */
        options.absorb.apply(undefined, [ ctx ].concat(args))
        absorbed = true

        /*  automatically emit after a delay  */
        if (timer === null) {
            timer = setTimeout(() => {
                fn.emit()
                timer = null
            }, options.delay)
        }
    }

    /*  provide manual emit possibility  */
    fn.emit = () => {
        /*  short-circuit processing  */
        if (cancelled)
            return
        if (!absorbed)
            return

        /*  create and switch to new context  */
        const ctxNew = {}
        options.reset(ctxNew)
        const ctxOld = ctx
        ctx = ctxNew
        absorbed = false

        /*  emit old context  */
        options.emit(ctxOld)
    }

    /*  provide cancellation possibility  */
    fn.cancel = () => {
        if (cancelled)
            throw new Error("chunking already destroyed")
        if (timer !== null) {
            clearTimeout(timer)
            timer = null
        }
        cancelled = true
    }

    /*  initially (re)set the context  */
    options.reset(ctx)

    /*  return the chunking API function  */
    return fn
}

/*  export the API function  */
module.exports = chunking

