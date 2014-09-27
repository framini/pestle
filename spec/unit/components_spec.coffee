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

            after ->
                delete NGS.modules.dummy

            it 'should call the initialize method defined in the component', ->
                NGS.modules.dummy.initialize.should.have.been.called
                NGS.modules.dummy2.initialize.should.have.been.called
                NGS.modules.dummy3.initialize.should.have.been.called

            it 'should give each component access to a sandbox', () ->
                NGS.modules.dummy.sandbox.should.be.an 'object'
                NGS.modules.dummy2.sandbox.should.be.an 'object'
                NGS.modules.dummy3.sandbox.should.be.an 'object'

            it 'should give each component access to a options object containing the options passed data-* attributes', ->
                NGS.modules.dummy.options.should.be.an 'object'
                NGS.modules.dummy2.options.should.be.an 'object'
                NGS.modules.dummy3.options.should.be.an 'object'

            it 'should give access to the "el" element used to define the component', ->
                NGS.modules.dummy.options.el.should.be.defined
                $(NGS.modules.dummy.options.el).should.exist

                NGS.modules.dummy2.options.el.should.be.defined
                $(NGS.modules.dummy2.options.el).should.exist

                NGS.modules.dummy3.options.el.should.be.defined
                $(NGS.modules.dummy3.options.el).should.exist

            it 'should give access to each attr listed as data-NAMESPACE-* (different from data-NAMESPACE-component)', ->
                $(NGS.modules.dummy.options.el).should.have.data('lodgesDataset')
                $(NGS.modules.dummy.options.el).should.have.data('lodgesObject')
                $(NGS.modules.dummy.options.el).should.have.data('lodgesString')
                NGS.modules.dummy.options.dataset.should.be.an 'array'
                NGS.modules.dummy.options.object.should.be.an 'object'
                NGS.modules.dummy.options.string.should.be.an 'string'
                # the 3 passed + the one automatically added (el)
                NGS.modules.dummy.options.length.should.be.equal 4

                $(NGS.modules.dummy2.options.el).should.have.data('lodgesObject2')
                $(NGS.modules.dummy2.options.el).should.have.data('lodgesString2')
                NGS.modules.dummy2.options.object2.should.be.an 'object'
                NGS.modules.dummy2.options.string2.should.be.an 'string'
                # the 2 passed + the one automatically added (el)
                NGS.modules.dummy2.options.length.should.be.equal 3

                $(NGS.modules.dummy3.options.el).should.have.data('lodgesDataset')
                NGS.modules.dummy3.options.dataset.should.be.an 'array'
                # the 1 passed + the one automatically added (el)
                NGS.modules.dummy3.options.length.should.be.equal 2

            it 'should give each component an unique sandbox', ->
                NGS.modules.dummy.sandbox.should.not.deep.equal NGS.modules.dummy2.sandbox
                NGS.modules.dummy2.sandbox.should.not.deep.equal NGS.modules.dummy3.sandbox
                NGS.modules.dummy3.sandbox.should.not.deep.equal NGS.modules.dummy.sandbox






