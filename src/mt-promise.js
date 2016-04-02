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
