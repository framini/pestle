VersionChecker = require '../../../src/util/versionchecker.coffee'

describe 'VersionChecker', ->

    it 'should provide a check method', ->
        VersionChecker.check.should.be.a 'function'

    it 'should throw an error when a hard dependency hasn\'t been loaded', ->

        dependencies = [
                "name": "jQuery"
                "required": "1.9" # required version by Pestle
                "obj": undefined # global object
                "version": "0" # emulates loaded version on the root env
        ]

        state = () => VersionChecker.check(dependencies)
        state.should.throw(Error)

    it 'should throw an error when the required version of a hard dependency hasn\'t been meet', ->

        dependencies = [
                "name": "jQuery"
                "required": "1.9" # required version by Pestle
                "obj": $ # global object
                "version": "1.8" # emulates loaded version on the root env
        ]

        state = () => VersionChecker.check(dependencies)
        state.should.throw(Error)

    it 'should do nothing when all requirements haven been meet', ->

        dependencies = [
                "name": "jQuery"
                "required": "1.10" # required version
                "obj": $ # global object
                "version": if $ then $.fn.jquery else 0 # gives the version number
                                                                  # of the loaded lib
            ,
                "name": "Underscore"
                "required": "1.7.0" # required version
                "obj": _ # global object
                "version": if _ then _.VERSION else 0
        ]

        state = () => VersionChecker.check(dependencies)
        state.should.not.throw(Error)
