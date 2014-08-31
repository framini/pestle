ExtManager = require '../../src/extmanager.coffee'

describe 'ExtManager', ->

    extManager = new ExtManager()

    it 'should be a constructor', ->
        ExtManager.should.be.a 'function'

    it 'should have an Add method', ->
        extManager.add.should.be.a 'function'

    it 'should have an Init method', ->
        extManager.init.should.be.a 'function'

    it 'should have a getInitializedExtensions method', ->
        extManager.getInitializedExtensions.should.be.a 'function'

    describe 'adding extensions', ->

        it 'should be possible to add new extensions', ->

            ext1 =
                initialize: sinon.spy (app) ->
                    
                    app.sandbox.foo = 'bar'

                afterAppStarted: sinon.spy()

            ext2 =
                initialize: sinon.spy (app) ->
                    
                    app.sandbox.bar = 'foo'

                afterAppStarted: sinon.spy()

            # for this particular example we only need the sandbox property
            # on the context
            context = { sandbox: {} }

            # use the method add from the extensionManager to add the
            # new extensions and prepare them to be initialized
            extManager.add(ext1)
            extManager.add(ext2)

            # initialize the extensions using a mocked context
            extManager.init(context)

            ext1.initialize.should.have.been.calledWith(context)
            ext1.initialize.should.have.been.calledWith(context)

        it 'should not be possible to add the same extension twice', ->
            ext1 =
                initialize: sinon.spy (app) ->
                    
                    app.sandbox.foo = 'bar'

                afterAppStarted: sinon.spy()

            extManager.add(ext1)
            state = () => extManager.add(ext1)

            state.should.throw(Error)

        it 'should be possible to retrieve added extensions', ->
            extensions = extManager.getInitializedExtensions()

            extensions.should.be.an 'array'

