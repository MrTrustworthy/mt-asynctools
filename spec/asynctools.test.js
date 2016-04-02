"use strict";

let asynctools = require("../build/mt-asynctools");


describe("The test setup", function () {

    beforeEach(function () {

        this.foo = 1;

    });

    it("works", function () {

        expect(this.foo).toEqual(1);

    });

    it("can find the imported base module", function () {

        expect(asynctools).toBeDefined();

    });

    it("can find the promise module", function () {

        expect(asynctools.Promise).toBeDefined();

    });

    it("can instantiate a promise", function () {

        let promise = new asynctools.Promise();

        expect(promise).toBeDefined();

    });

});

/**
 * This suite tries to conform to the PromiseA+ specification as of https://promisesaplus.com/
 */
describe("A Promise", function () {

    let Promise = asynctools.Promise;

    beforeEach(function () {

        this.promise = new asynctools.Promise();

    });

    afterEach(function () {

        this.promise = null;

    });

    // Basic tests

    it("has a then-function", function () {

        expect(this.promise.then instanceof Function).toBe(true);

    });

    it("is initially pending", function () {

        expect(this.promise.state).toBe("pending");

    });

    it("'ses state can't be changed when fulfilled", function () {

        this.promise.state = "fulfilled";

        expect(() => this.promise.state = "pending").toThrow();

    });

    it("'ses state can't be changed when rejected", function () {

        this.promise.state = "rejected";

        expect(() => this.promise.state = "pending").toThrow();

    });

    it("'ses state can't be changed to nonsense", function () {

        expect(() => this.promise.state = "blubb").toThrow();

    });


    xit("'ses value can't be changed when fulfilled", function () {

        this.promise.state = "fulfilled";

        expect(() => this.promise.state = "pending").toThrow();

    });

    xit("'ses reason can't be changed when rejected", function () {

        this.promise.state = "rejected";

        expect(() => this.promise.state = "pending").toThrow();

    });


});

describe("Resolving a Promise", function () {

    let Promise = asynctools.Promise;

    beforeEach(function () {

        this.promise = new asynctools.Promise();

    });

    afterEach(function () {

        this.promise = null;

    });

    // resolve tests

    it("has a resolve function", function () {

        expect(this.promise.resolve instanceof Function).toBe(true);

    });


    it("fails when resolved with itself", function () {

        expect(() => this.promise.resolve(this.promise)).toThrowError(TypeError);

    })

});

