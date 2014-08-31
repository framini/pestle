Base = require '../../src/base.coffee'

describe 'Base', ->

    beforeEach ->
        @pepe = fixture.load('test.html')

    afterEach ->
        fixture.cleanup()

    it 'plays with the html fixture', ->
        expect(fixture.el.firstChild).to.equal(@pepe[0])

    it 'should provide', ->
        expect(Base).to.have.property('log')