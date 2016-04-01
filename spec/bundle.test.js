"use strict";

let bundle = require("../build/bundle");

describe("The test setup", function() {

    beforeEach(function() {
        this.foo = 1;
    });

    afterEach(function() {
        this.foo = 0;
    });

    it("works", function() {

        expect(this.foo).toEqual(1);

    });

    it("can find the imported module", function() {

        expect(bundle).toBeDefined();

    });


});

