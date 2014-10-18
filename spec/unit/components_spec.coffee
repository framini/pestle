Component = require '../../src/extension/components.coffee'
Core = require '../../src/core.coffee'

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
        Component.classes.should.be.defined

    describe 'Component class', ->

        # access the exposed Component class
        cmp = Component.classes

        # object that will store initialized components
        initializedComponents = {}

        it 'should have a startAll method', ->
            cmp.startAll.should.be.a 'function'

        it.skip 'should have a start method to initialize one component', ->
            cmp.start.should.be.a 'function'

        describe 'Starting multiple components', ->

            before ->

                NGS.modules.dummy =
                    initialize : sinon.spy (app) ->

                    afterAppStarted: sinon.spy()

                NGS.modules.dummy2 =
                    initialize : sinon.spy (app) ->

                    afterAppStarted: sinon.spy()

                NGS.modules.dummy3 =
                    initialize : sinon.spy (app) ->

                    afterAppStarted: sinon.spy()

                # Starts all the components present in the 'body'
                cmp.startAll('body', new NGS.Core())

                initializedComponents = cmp.initializedComponents

            after ->
                delete NGS.modules.dummy
                delete NGS.modules.dummy2
                delete NGS.modules.dummy3

            it 'should call the initialize method defined in the component', ->
                _.each initializedComponents, (m, i) ->
                    m.initialize.should.have.been.called

            it 'should give each component access to a sandbox', () ->
                _.each initializedComponents, (m, i) ->
                    m.sandbox.should.be.an 'object'

            it 'should give each component access to a options object containing the options passed data-* attributes', ->
                _.each initializedComponents, (m, i) ->
                    m.options.should.be.an 'object'

            it 'should give access to the "el" element used to define the component', ->
                _.each initializedComponents, (m, i) ->
                    m.options.el.should.be.defined
                    $(m.options.el).should.exist

            it 'should give access to each attr listed as data-NAMESPACE-* (different from data-NAMESPACE-component)', ->
                _.each initializedComponents, (m, i) ->

                    if $(m.options.el).data('lodges-component') == "dummy"
                        $(m.options.el).should.have.data('lodgesDataset')
                        $(m.options.el).should.have.data('lodgesObject')
                        $(m.options.el).should.have.data('lodgesString')
                        m.options.dataset.should.be.an 'array'
                        m.options.object.should.be.an 'object'
                        m.options.string.should.be.an 'string'
                        # the 3 passed + the one automatically added (el)
                        m.options.length.should.be.equal 4

                    else if $(m.options.el).data('lodges-component') == "dummy2"
                        $(m.options.el).should.have.data('lodgesObject2')
                        $(m.options.el).should.have.data('lodgesString2')
                        m.options.object2.should.be.an 'object'
                        m.options.string2.should.be.an 'string'
                        # the 2 passed + the one automatically added (el)
                        m.options.length.should.be.equal 3

                    else if $(m.options.el).data('lodges-component') == "dummy3"
                        $(m.options.el).should.have.data('lodgesDataset')
                        m.options.dataset.should.be.an 'array'
                        # the 1 passed + the one automatically added (el)
                        m.options.length.should.be.equal 2

            it 'should give each component an unique sandbox', ->

                _.each initializedComponents, (m, i) ->

                    # compare the sandbox against all other sandboxes
                    _.each initializedComponents, (mc, j) ->
                        if i != j
                            m.sandbox.should.not.deep.equal mc.sandbox
