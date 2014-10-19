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

    describe 'Extensions', ->

        ext1 =
            initialize: sinon.spy (app) ->

                app.sandbox.foo = 'bar'

            afterAppStarted: sinon.spy()

            optionKey: 'ext1'

        ext2 =
            initialize: sinon.spy (app) ->

                app.sandbox.bar = 'foo'

            afterAppStarted: sinon.spy()

            optionKey: 'ext2'

        # for this particular example we only need the sandbox property
        # on the context
        context = { sandbox: {}, config: { extension: {} } }

        it 'should be possible to add new extensions', ->
            # use the method add from the extensionManager to add the
            # new extensions and prepare them to be initialized
            extManager.add(ext1)
            extManager.add(ext2)

        it 'should not be possible to add the same extension twice', ->

            state = () => extManager.add(ext1)

            state.should.throw(Error)

        it 'should be possible to retrieve added extensions', ->
            extensions = extManager.getExtensions()

            extensions.should.be.an 'array'
            extensions.length.should.be.equal 2

        it 'should be possible to retrieve added extensions by name', ->
            extension1 = extManager.getExtensionByName('ext1')
            extension2 = extManager.getExtensionByName('ext2')

            extension1.should.be.an 'array'
            extension1.length.should.be.equal 1

            extension2.should.be.an 'array'
            extension2.length.should.be.equal 1

        it 'should be possible to initialize added extensions', ->
            # initialize the extensions using a mocked context
            extManager.init(context)

            ext1.initialize.should.have.been.calledWith(context)
            ext2.initialize.should.have.been.calledWith(context)

        it 'should be possible to retrieve all initialized extensions', ->
            extensions = extManager.getInitializedExtensions()

            extensions.should.be.an 'array'
            extensions.length.should.be.equal 2

        it 'should be possible to retrieve initialized extensions by name', ->
            extension1 = extManager.getInitializedExtensionByName('ext1')
            extension2 = extManager.getInitializedExtensionByName('ext2')

            extension1.should.be.an 'array'
            extension1.length.should.be.equal 1

            extension2.should.be.an 'array'
            extension2.length.should.be.equal 1
