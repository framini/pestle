Utils = require '../../../src/util/general.coffee'

describe 'General', ->

    it 'should have a versionCompare method', ->
        Utils.versionCompare.should.be.a 'function'

    it 'should be able to compare semantic versioning with versionCompare', ->

        # lower than
        Utils.versionCompare("1.2.10", "1.3").should.equal -1
        Utils.versionCompare("1.2", "1.3.0").should.equal -1
        Utils.versionCompare("1.2.0", "1.3.0").should.equal -1
        Utils.versionCompare("1.2.9", "1.3.0").should.equal -1
        Utils.versionCompare("1.3", "1.3.1").should.equal -1
        Utils.versionCompare("1.3.0", "1.3.1").should.equal -1
        Utils.versionCompare("9.3.1", "10.3.1").should.equal -1
        Utils.versionCompare("9.30.1", "10.30.1").should.equal -1
        Utils.versionCompare("9.30.10", "10.30.10").should.equal -1
        Utils.versionCompare("1.30.50", "2.9").should.equal -1
        Utils.versionCompare("1.30", "1.30.0").should.equal -1

        # equal
        Utils.versionCompare("1.2.10", "1.2.10").should.equal 0
        Utils.versionCompare("1.2", "1.2").should.equal 0
        Utils.versionCompare("1.2.0", "1.2.0").should.equal 0
        Utils.versionCompare("1.2.9", "1.2.9").should.equal 0
        Utils.versionCompare("1.3", "1.3").should.equal 0
        Utils.versionCompare("1.3.0", "1.3.0").should.equal 0
        Utils.versionCompare("9.3.1", "9.3.1").should.equal 0
        Utils.versionCompare("9.30.1", "9.30.1").should.equal 0
        Utils.versionCompare("9.30.10", "9.30.10").should.equal 0
        Utils.versionCompare("1.30.50", "1.30.50").should.equal 0
        Utils.versionCompare("1.30.0", "1.30", zeroExtend : true).should.equal 0

        # greater than
        Utils.versionCompare("1.3", "1.2.10").should.equal 1
        Utils.versionCompare("1.3.0", "1.2").should.equal 1
        Utils.versionCompare("1.3.0", "1.2.0").should.equal 1
        Utils.versionCompare("1.3.0", "1.2.9").should.equal 1
        Utils.versionCompare("1.3.1", "1.3").should.equal 1
        Utils.versionCompare("1.3.1", "1.3.0").should.equal 1
        Utils.versionCompare("10.3.1", "9.3.1").should.equal 1
        Utils.versionCompare("10.30.1", "9.30.1").should.equal 1
        Utils.versionCompare("10.30.10", "9.30.10").should.equal 1
        Utils.versionCompare("2.9", "1.30.50").should.equal 1
        Utils.versionCompare("1.30.0", "1.30").should.equal 1
        Utils.versionCompare("1.30.0b", "1.30.0", lexicographical: true).should.equal 1
