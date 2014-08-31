Base = require '../../src/base.coffee'

describe 'Base', ->
    it 'should provide', ->
        expect(Base).to.have.property('log')