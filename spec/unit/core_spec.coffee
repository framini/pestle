Base = require '../../src/base.coffee'
ExtManager = require '../../src/extmanager.coffee'
Core = require '../../src/core.coffee'

describe 'Core', ->
   
    beforeEach ->
        @core = new NGL.Core()

        @ext =
            initialize: sinon.spy (app) ->
                
                app.sandbox.bar = 'foo'

            afterAppStarted: sinon.spy()

        @core.addExtension(@ext)

        @core.start()

    it 'should have a public API', ->
        @core.start.should.be.a 'function'
        @core.addExtension.should.be.a 'function'

    it 'should throw an error if an extensions is added after the Core has been started', ->
        state = () => @core.addExtension( initialize: () -> )
        state.should.throw(Error)

    describe 'Extension Manager', ->

        it 'should have an instance of the extension manager', ->
            @core.extManager.should.be.an.instanceOf(ExtManager)

        it 'should call the initialize method for each extension', ->
            @ext.initialize.should.have.been.called

        it 'should pass the core as an argument to the initialize method for extensions', ->
            @ext.initialize.should.have.been.calledWith(@core)


        it 'should call the after afterAppStarted on each extension', ->
            @ext.afterAppStarted.should.have.been.called


    describe 'Base libraries', ->

        describe 'Logger', ->

            it 'should have a Logger available', ->
                Base.should.have.property('log')
            
            it 'should provide a way to set logging levels', ->
                Base.log.setLevel.should.be.a('function')

            it 'should available within sandboxes', ->
                sb = @core.createSandbox('test')
                sb.log.should.be.defined

            it 'should provide a function to log trace messages', ->
                Base.log.trace.should.be.a('function')

            it 'should provide a function to log debug messages', ->
                Base.log.debug.should.be.a('function')

            it 'should provide a function to log info messages', ->
                Base.log.info.should.be.a('function')

            it 'should provide a function to log warning messages', ->
                Base.log.warn.should.be.a('function')

            it 'should provide a function to log error messages', ->
                Base.log.error.should.be.a('function')





