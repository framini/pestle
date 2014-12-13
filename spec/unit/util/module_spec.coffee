Utils     = require '../../../src/util/module.coffee'
Module    = require '../../../src/util/module.coffee'
Component = require '../../../src/extension/components.coffee'

describe 'Module', ->

    # namespace for storing added components
    Modules = {}

    @dummycomponent = fixture.load 'examplecomponents.html'

    # object that will store initialized components
    initializedComponents = {}
    # Reference of the Component class
    cmp = Component.classes

    $('body').append(@dummycomponent)

    before ->
        # Old way of defining modules
        Modules.Example1 =
            initialize : sinon.spy (app) ->

        Module.add 'Example2',
            initialize : sinon.spy (app) ->

        Module.add 'Example3',
            initialize : sinon.spy (app) ->

        Module.extend 'Example4', {
            initialize: sinon.spy (app) ->
                @_super_()
            }, 'Example3'

        # Starts all the components present in the 'body'
        initializedComponents = cmp.startAll('body', new Pestle.Core(), Modules)

    after ->
        fixture.cleanup()
        cmp.initializedComponents = {}

    it 'should expose an add method', ->
        Module.add.should.be.a 'function'

    it 'should expose get method to retreive module\'s definitions', ->
        Module.get.should.be.a 'function'

    it 'should expose an extend method', ->
        Module.extend.should.be.a 'function'

    it 'should expose an object containing added modules', ->
        Module.list.should.be.an 'object'

    describe 'extend method', ->

        it 'should add the modules definitions to Pestle.modules', ->
            Modules['Example1'].should.be.a 'function'
            Modules['Example2'].should.be.a 'function'
            Modules['Example3'].should.be.a 'function'
            Modules['Example4'].should.be.a 'function'

        it 'should throw an error if we try to extend from a module that doesn\'t exist', ->
            state = () =>
                Module.extend 'Example5', {
                    initialize: sinon.spy (app) ->
                        @_super_()
                    }, 'Example8'
            state.should.throw(Error)

        it 'should allow to call _super_() when a module extends from another', ->
            _.each initializedComponents, (m, key) ->
                if key.indexOf('Example4') > -1
                    m._super_.should.be.a 'function'

    describe 'Modules base class', ->

        M = Module.Module
        m = new M(options: {}, sandbox: {})

        it 'should provide an initialize method (it should be ovewritten)', ->
            m.initialize.should.be.a 'function'

        it 'should provide a default initialize method (meant to be ovewritten)', ->
            m.initialize.should.be.a 'function'

        it 'should provide a default stop metjod (meant to be ovewritten)', ->
            m.stop.should.be.a 'function'
