Component = require '../../src/extension/components.coffee'
Core = require '../../src/core.coffee'
Module = require('../../src/util/module.coffee')

describe 'Components Extension', ->

    before ->
        @dummycomponent = fixture.load 'dummycomponent.html'

        $('body').append(@dummycomponent)

    after ->
        fixture.cleanup()

    it 'should have an initialize method', ->
        Component.initialize.should.be.a 'function'

    it 'should have a afterAppStarted method', ->
        Component.afterAppStarted.should.be.a 'function'

    it 'should have a name defined', ->
        Component.name.should.be.a 'string'

    it 'should have the class that gives the behavior to the extension exposed', ->
        Component.classes.should.be.a 'function'

    describe 'Component class', ->

        # access the exposed Component class
        cmp = Component.classes

        # object that will store initialized components
        initializedComponents = {}
        initializedComponents2 = {}

        it 'should have a startAll method', ->
            cmp.startAll.should.be.a 'function'

        it.skip 'should have a start method to initialize one component', ->
            cmp.start.should.be.a 'function'

        describe 'Starting multiple components', ->

            before ->

                Module.add 'dummy',
                    initialize : (app) ->

                    afterAppStarted: sinon.spy()

                Module.add 'dummy2',
                    initialize : sinon.spy (app) ->

                    afterAppStarted: sinon.spy()

                Module.add 'dummy3',
                    initialize : sinon.spy (app) ->

                    afterAppStarted: sinon.spy()

                Module.add 'dummy4',
                    initialize : sinon.spy (app) ->

                    afterAppStarted: sinon.spy()

                Module.add 'dummy5',
                    initialize : sinon.spy (app) ->

                    afterAppStarted: sinon.spy()

                # example for spying in existing methods
                def = Module.get('dummy')
                sinon.spy def.prototype, 'initialize'

            after ->
                delete Pestle.modules.dummy
                delete Pestle.modules.dummy2
                delete Pestle.modules.dummy3

            it 'should only start components that belongs to the passed selector', ->

                # Starts all the components present in the 'dummycontainer-1'
                initializedComponents = cmp.startAll('.dummycontainer-1', new Pestle.Core())

                # in the fixture there are 3 components defined within dummycontainer-1
                # and 2 in dummycontainer-2
                _.size(initializedComponents.all).should.be.equal 3

                _.each initializedComponents.all, (m, i) ->
                    $(m.options.el).data('platform-component').should.be.not.equal 'dummy4'
                    $(m.options.el).data('platform-component').should.be.not.equal 'dummy5'


                initializedComponents2 = cmp.startAll('.dummycontainer-2', new Pestle.Core())

                _.size(initializedComponents.all).should.be.equal 5
                _.size(initializedComponents2.all).should.be.equal 5
                _.size(initializedComponents2.new).should.be.equal 2

                _.each initializedComponents2.new, (m, i) ->
                    $(m.options.el).data('platform-component').should.be.not.equal 'dummy'
                    $(m.options.el).data('platform-component').should.be.not.equal 'dummy2'
                    $(m.options.el).data('platform-component').should.be.not.equal 'dummy3'

            it 'should ensure that all modules definition within Pestle.modules extends from class Module', ->
                _.each Pestle.modules, (m, i) ->
                    # TODO: right we are checking that it is a function, not that extends from Module
                    # we'll have to find a better way to check this
                    m.should.be.a 'function'

            it 'should call the initialize method defined in the component', ->
                _.each initializedComponents.all, (m, i) ->
                    m.initialize.should.have.been.called

            it 'should give each component access to a sandbox', () ->
                _.each initializedComponents.all, (m, i) ->
                    m.sandbox.should.be.an 'object'

            it 'should give each component access to a options object containing the options passed data-* attributes', ->
                _.each initializedComponents.all, (m, i) ->
                    m.options.should.be.an 'object'

            it 'should give access to the "el" element used to define the component', ->
                _.each initializedComponents.all, (m, i) ->
                    m.options.el.should.be.defined
                    $(m.options.el).should.exist

            it 'should give access to each attr listed as data-NAMESPACE-* (different from data-NAMESPACE-component)', ->
                _.each initializedComponents.all, (m, i) ->

                    if $(m.options.el).data('platform-component') == "dummy"
                        $(m.options.el).should.have.data('platformDataset')
                        $(m.options.el).should.have.data('platformObject')
                        $(m.options.el).should.have.data('platformString')
                        m.options.dataset.should.be.an 'array'
                        m.options.object.should.be.an 'object'
                        m.options.string.should.be.an 'string'
                        # the 3 passed + the one automatically added (el)
                        m.options.length.should.be.equal 4

                    else if $(m.options.el).data('platform-component') == "dummy2"
                        $(m.options.el).should.have.data('platformObject2')
                        $(m.options.el).should.have.data('platformString2')
                        m.options.object2.should.be.an 'object'
                        m.options.string2.should.be.an 'string'
                        # the 2 passed + the one automatically added (el)
                        m.options.length.should.be.equal 3

                    else if $(m.options.el).data('platform-component') == "dummy3"
                        $(m.options.el).should.have.data('platformDataset')
                        m.options.dataset.should.be.an 'array'
                        # the 1 passed + the one automatically added (el)
                        m.options.length.should.be.equal 2

            it 'should give each component an unique sandbox', ->

                _.each initializedComponents.all, (m, i) ->

                    # compare the sandbox against all other sandboxes
                    _.each initializedComponents.all, (mc, j) ->
                        if i != j
                            m.sandbox.should.not.deep.equal mc.sandbox
