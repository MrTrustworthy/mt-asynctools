(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mtAsynctools = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

module.exports.Promise = _dereq_("./mt-promise");


},{"./mt-promise":2}],2:[function(_dereq_,module,exports){
"use strict";

/**
 * List of constants for the states
 */
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";


/**
 * Using constant symbols to hide data properties that should not be accessed.
 * If someone wants to do stuff with the Promise that it's not designed for,
 * the person then at least has to read the source code :P
 * @type {Symbol}
 */
const valueSymbol = Symbol("value");
const reasonSymbol = Symbol("reason");
const notSetSymbol = Symbol("unsetValue");
const stateSymbol = Symbol("state");


/**
 * This is a PromiseA+ ( https://promisesaplus.com/ ) compatible Promise object.
 */
class Promise {

    /**
     * Data properties are hidden behind symbols and accessable via setters/getters.
     * This helps to hide complexity and enforcing the contract.
     */
    constructor() {

        // initially all promises are set to "pending", this can only be changed once

        this[stateSymbol] = PENDING;

        // make sure we can detect whether those values have been set before

        this[valueSymbol] = notSetSymbol;

        this[reasonSymbol] = notSetSymbol;

        this.onFulfilled = [];

        this.onRejected = [];

    }


    /**
     * Resolves a promise according to specification.
     *
     * Spec reference denoted with chapter numbers.
     *
     * @param value
     */
    resolve(value) {

        // 2.3.1

        if (value === this) {

            throw new TypeError("A Promise can't be resolved with itself");

        }

        if (value instanceof Promise) {

            // 2.3.2

            let onFulfilled = function (value) {

                this.fulfill(value);

            }.bind(this);

            let onRejected = function (reason) {

                this.reject(reason);

            }.bind(this);

            value.then(onFulfilled, onRejected);


        } else if (value instanceof Object || value instanceof Function) {

            // 2.3.3

            let then;

            // 2.3.3.2

            try {

                then = value.then;

            } catch (e) {

                this.reject(e);

                return;

            }

            // 2.3.3.4

            if (then instanceof Function) {

                // call the function and, if it returns a value, resolve again with that value

                // also make sure to prohibit multiple calls without raising errors

                let alreadyCalled = false;


                let resolvePromise = function (derivedValue) {

                    if (alreadyCalled) return;

                    alreadyCalled = true;

                    this.resolve(derivedValue);

                }.bind(this);

                let rejectPromise = function (reason) {

                    if (alreadyCalled) return;

                    alreadyCalled = true;

                    this.reject(reason);

                }.bind(this);


                try {

                    then.call(value, resolvePromise, rejectPromise);

                } catch (e) {

                    // if a callback has been executed, ignore errors. see 2.3.3.4.1

                    if (alreadyCalled) return;

                    this.reject(e);

                }

            } else {

                // 2.3.3.4

                this.fulfill(value);

            }


        } else {

            // 2.3.4

            this.fulfill(value);

        }

    }


    /**
     * Then-function as specified in https://promisesaplus.com/ Chapter 2.2
     *
     * Spec reference denoted with chapter numbers.
     *
     * @param onFulfilled
     * @param onRejected
     */
    then(onFulfilled, onRejected) {

        let derivedPromise = new Promise();

        if(onFulfilled instanceof Function){

            this.onFulfilled.push(onFulfilled);



        }

        if(onRejected instanceof Function){

            this.onRejected.push(onRejected);


        }


        return derivedPromise;

    }


    // TODO: HIDE YO KIDS HIDE YO FUNCTIONS

    fulfill(value) {

        this.state = FULFILLED;

        this.value = value;

        this.onFulfilled.forEach(function(callback){

            callback(this.value);

        });

    }

    reject(reason) {

        this.state = REJECTED;

        this.reason = reason;

    }


    /**
     *
     * @returns {*}
     */
    get state() {

        return this[stateSymbol];

    }


    /**
     *
     * @param newState
     */
    set state(newState) {

        if (this[stateSymbol] !== PENDING) {

            throw new Error("Can't set the state of a Promise that isn't pending anymore");
        }

        if (newState !== FULFILLED && newState !== REJECTED) {

            throw new Error("Need to set the state of a Promise to either fulfilled or rejected, not", newState);

        }

        else this[stateSymbol] = newState;

    }


    /**
     *
     * @returns {*}
     */
    get value() {

        return this[valueSymbol];

    }


    /**
     *
     * @param newValue
     */
    set value(newValue) {

        if (this[valueSymbol] !== notSetSymbol) {

            throw new Error("This Promises value is already set, can not set value");

        }

        if (this[reasonSymbol] !== notSetSymbol) {

            throw new Error("This Promises reason is already set, can not set value");

        }

        this[valueSymbol] = newValue;

    }


}

module.exports = Promise;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbG9hZGVyLmpzIiwic3JjL210LXByb21pc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMuUHJvbWlzZSA9IHJlcXVpcmUoXCIuL210LXByb21pc2VcIik7XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBMaXN0IG9mIGNvbnN0YW50cyBmb3IgdGhlIHN0YXRlc1xyXG4gKi9cclxuY29uc3QgUEVORElORyA9IFwicGVuZGluZ1wiO1xyXG5jb25zdCBGVUxGSUxMRUQgPSBcImZ1bGZpbGxlZFwiO1xyXG5jb25zdCBSRUpFQ1RFRCA9IFwicmVqZWN0ZWRcIjtcclxuXHJcblxyXG4vKipcclxuICogVXNpbmcgY29uc3RhbnQgc3ltYm9scyB0byBoaWRlIGRhdGEgcHJvcGVydGllcyB0aGF0IHNob3VsZCBub3QgYmUgYWNjZXNzZWQuXHJcbiAqIElmIHNvbWVvbmUgd2FudHMgdG8gZG8gc3R1ZmYgd2l0aCB0aGUgUHJvbWlzZSB0aGF0IGl0J3Mgbm90IGRlc2lnbmVkIGZvcixcclxuICogdGhlIHBlcnNvbiB0aGVuIGF0IGxlYXN0IGhhcyB0byByZWFkIHRoZSBzb3VyY2UgY29kZSA6UFxyXG4gKiBAdHlwZSB7U3ltYm9sfVxyXG4gKi9cclxuY29uc3QgdmFsdWVTeW1ib2wgPSBTeW1ib2woXCJ2YWx1ZVwiKTtcclxuY29uc3QgcmVhc29uU3ltYm9sID0gU3ltYm9sKFwicmVhc29uXCIpO1xyXG5jb25zdCBub3RTZXRTeW1ib2wgPSBTeW1ib2woXCJ1bnNldFZhbHVlXCIpO1xyXG5jb25zdCBzdGF0ZVN5bWJvbCA9IFN5bWJvbChcInN0YXRlXCIpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGlzIGEgUHJvbWlzZUErICggaHR0cHM6Ly9wcm9taXNlc2FwbHVzLmNvbS8gKSBjb21wYXRpYmxlIFByb21pc2Ugb2JqZWN0LlxyXG4gKi9cclxuY2xhc3MgUHJvbWlzZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEYXRhIHByb3BlcnRpZXMgYXJlIGhpZGRlbiBiZWhpbmQgc3ltYm9scyBhbmQgYWNjZXNzYWJsZSB2aWEgc2V0dGVycy9nZXR0ZXJzLlxyXG4gICAgICogVGhpcyBoZWxwcyB0byBoaWRlIGNvbXBsZXhpdHkgYW5kIGVuZm9yY2luZyB0aGUgY29udHJhY3QuXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsbHkgYWxsIHByb21pc2VzIGFyZSBzZXQgdG8gXCJwZW5kaW5nXCIsIHRoaXMgY2FuIG9ubHkgYmUgY2hhbmdlZCBvbmNlXHJcblxyXG4gICAgICAgIHRoaXNbc3RhdGVTeW1ib2xdID0gUEVORElORztcclxuXHJcbiAgICAgICAgLy8gbWFrZSBzdXJlIHdlIGNhbiBkZXRlY3Qgd2hldGhlciB0aG9zZSB2YWx1ZXMgaGF2ZSBiZWVuIHNldCBiZWZvcmVcclxuXHJcbiAgICAgICAgdGhpc1t2YWx1ZVN5bWJvbF0gPSBub3RTZXRTeW1ib2w7XHJcblxyXG4gICAgICAgIHRoaXNbcmVhc29uU3ltYm9sXSA9IG5vdFNldFN5bWJvbDtcclxuXHJcbiAgICAgICAgdGhpcy5vbkZ1bGZpbGxlZCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLm9uUmVqZWN0ZWQgPSBbXTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzb2x2ZXMgYSBwcm9taXNlIGFjY29yZGluZyB0byBzcGVjaWZpY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFNwZWMgcmVmZXJlbmNlIGRlbm90ZWQgd2l0aCBjaGFwdGVyIG51bWJlcnMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHJlc29sdmUodmFsdWUpIHtcclxuXHJcbiAgICAgICAgLy8gMi4zLjFcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzKSB7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQSBQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmXCIpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIDIuMy4yXHJcblxyXG4gICAgICAgICAgICBsZXQgb25GdWxmaWxsZWQgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGZpbGwodmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9uUmVqZWN0ZWQgPSBmdW5jdGlvbiAocmVhc29uKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWplY3QocmVhc29uKTtcclxuXHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHZhbHVlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCB8fCB2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcblxyXG4gICAgICAgICAgICAvLyAyLjMuM1xyXG5cclxuICAgICAgICAgICAgbGV0IHRoZW47XHJcblxyXG4gICAgICAgICAgICAvLyAyLjMuMy4yXHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoZW4gPSB2YWx1ZS50aGVuO1xyXG5cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0KGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIDIuMy4zLjRcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGVuIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBmdW5jdGlvbiBhbmQsIGlmIGl0IHJldHVybnMgYSB2YWx1ZSwgcmVzb2x2ZSBhZ2FpbiB3aXRoIHRoYXQgdmFsdWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBhbHNvIG1ha2Ugc3VyZSB0byBwcm9oaWJpdCBtdWx0aXBsZSBjYWxscyB3aXRob3V0IHJhaXNpbmcgZXJyb3JzXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJlc29sdmVQcm9taXNlID0gZnVuY3Rpb24gKGRlcml2ZWRWYWx1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeUNhbGxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlKGRlcml2ZWRWYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZWplY3RQcm9taXNlID0gZnVuY3Rpb24gKHJlYXNvbikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeUNhbGxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWplY3QocmVhc29uKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgcmVzb2x2ZVByb21pc2UsIHJlamVjdFByb21pc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgYSBjYWxsYmFjayBoYXMgYmVlbiBleGVjdXRlZCwgaWdub3JlIGVycm9ycy4gc2VlIDIuMy4zLjQuMVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxyZWFkeUNhbGxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlamVjdChlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDIuMy4zLjRcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bGZpbGwodmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIDIuMy40XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZ1bGZpbGwodmFsdWUpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZW4tZnVuY3Rpb24gYXMgc3BlY2lmaWVkIGluIGh0dHBzOi8vcHJvbWlzZXNhcGx1cy5jb20vIENoYXB0ZXIgMi4yXHJcbiAgICAgKlxyXG4gICAgICogU3BlYyByZWZlcmVuY2UgZGVub3RlZCB3aXRoIGNoYXB0ZXIgbnVtYmVycy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gb25GdWxmaWxsZWRcclxuICAgICAqIEBwYXJhbSBvblJlamVjdGVkXHJcbiAgICAgKi9cclxuICAgIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcclxuXHJcbiAgICAgICAgbGV0IGRlcml2ZWRQcm9taXNlID0gbmV3IFByb21pc2UoKTtcclxuXHJcbiAgICAgICAgaWYob25GdWxmaWxsZWQgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uRnVsZmlsbGVkLnB1c2gob25GdWxmaWxsZWQpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYob25SZWplY3RlZCBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub25SZWplY3RlZC5wdXNoKG9uUmVqZWN0ZWQpO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlcml2ZWRQcm9taXNlO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gVE9ETzogSElERSBZTyBLSURTIEhJREUgWU8gRlVOQ1RJT05TXHJcblxyXG4gICAgZnVsZmlsbCh2YWx1ZSkge1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0gRlVMRklMTEVEO1xyXG5cclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMub25GdWxmaWxsZWQuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjayl7XHJcblxyXG4gICAgICAgICAgICBjYWxsYmFjayh0aGlzLnZhbHVlKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlamVjdChyZWFzb24pIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFJFSkVDVEVEO1xyXG5cclxuICAgICAgICB0aGlzLnJlYXNvbiA9IHJlYXNvbjtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBnZXQgc3RhdGUoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzW3N0YXRlU3ltYm9sXTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuZXdTdGF0ZVxyXG4gICAgICovXHJcbiAgICBzZXQgc3RhdGUobmV3U3RhdGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXNbc3RhdGVTeW1ib2xdICE9PSBQRU5ESU5HKSB7XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBzZXQgdGhlIHN0YXRlIG9mIGEgUHJvbWlzZSB0aGF0IGlzbid0IHBlbmRpbmcgYW55bW9yZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChuZXdTdGF0ZSAhPT0gRlVMRklMTEVEICYmIG5ld1N0YXRlICE9PSBSRUpFQ1RFRCkge1xyXG5cclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmVlZCB0byBzZXQgdGhlIHN0YXRlIG9mIGEgUHJvbWlzZSB0byBlaXRoZXIgZnVsZmlsbGVkIG9yIHJlamVjdGVkLCBub3RcIiwgbmV3U3RhdGUpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2UgdGhpc1tzdGF0ZVN5bWJvbF0gPSBuZXdTdGF0ZTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXHJcbiAgICBnZXQgdmFsdWUoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzW3ZhbHVlU3ltYm9sXTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuZXdWYWx1ZVxyXG4gICAgICovXHJcbiAgICBzZXQgdmFsdWUobmV3VmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXNbdmFsdWVTeW1ib2xdICE9PSBub3RTZXRTeW1ib2wpIHtcclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgUHJvbWlzZXMgdmFsdWUgaXMgYWxyZWFkeSBzZXQsIGNhbiBub3Qgc2V0IHZhbHVlXCIpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzW3JlYXNvblN5bWJvbF0gIT09IG5vdFNldFN5bWJvbCkge1xyXG5cclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBQcm9taXNlcyByZWFzb24gaXMgYWxyZWFkeSBzZXQsIGNhbiBub3Qgc2V0IHZhbHVlXCIpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXNbdmFsdWVTeW1ib2xdID0gbmV3VmFsdWU7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcclxuIl19
