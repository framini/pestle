Base = require '../../src/base.coffee'
ExtManager = require '../../src/extmanager.coffee'
Core = require '../../src/core.coffee'

describe 'Core', ->
   
    core = new NGL.Core()

    ext =
        initialize: sinon.spy (app) ->
            
            app.sandbox.bar = 'foo'

        afterAppStarted: sinon.spy()

    core.addExtension(ext)

    core.start()

    # right now is setted to "lodges". It needs to be changed
    it.skip 'shoul provide "platform" as the default namespace', ->
        core.config.namespace.should.be.equal 'platform'

    it 'shoul provide a default logging level between 0 and 5', ->
        core.config.debug.logLevel.should.be.at.least(0).and.below(6)

    it 'should have a start Method', ->
        core.start.should.be.a 'function'

    it.skip 'should have a stop Method', ->
        core.stop.should.be.a 'function'

    it 'should have a addExtension Method', ->
        core.addExtension.should.be.a 'function'

    it 'should throw an error if an extensions is added after the Core has been started', ->
        state = () => core.addExtension( initialize: () -> )
        state.should.throw(Error)

    describe 'Extension Manager', ->

        it 'should have an instance of the extension manager', ->
            core.extManager.should.be.an.instanceOf(ExtManager)

        it 'should call the initialize method for each extension', ->
            ext.initialize.should.have.been.called

        it 'should pass the core as an argument to the initialize method for extensions', ->
            ext.initialize.should.have.been.calledWith(core)


        it 'should call the after afterAppStarted on each extension', ->
            ext.afterAppStarted.should.have.been.called


    describe 'Base libraries', ->

        # For these we are just going to check their APIs

        describe 'Logger', ->

            it 'should have a Logger available', ->
                Base.should.have.property('log')
            
            it 'should provide a way to set logging levels', ->
                Base.log.setLevel.should.be.a('function')

            it 'should be available within sandboxes', ->
                sb = core.createSandbox 'test'
                sb.should.have.property 'log'

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

        describe 'Device Detection', ->

            it 'should have Device Detector available', ->
                Base.should.have.property('device')

            it 'should be available within sandboxes', ->
                sb = core.createSandbox 'test'
                sb.should.have.property 'device'

            it 'should provide an isMobile method', ->
                Base.device.isMobile.should.be.a('function')

            it 'should provide an isTablet method', ->
                Base.device.isTablet.should.be.a('function')

            it 'should provide an isIphone method', ->
                Base.device.isIphone.should.be.a('function')

            it 'should provide an isIpod method', ->
                Base.device.isIpod.should.be.a('function')

            it 'should provide an isIpad method', ->
                Base.device.isIpad.should.be.a('function')

            it 'should provide an isApple method', ->
                Base.device.isApple.should.be.a('function')

            it 'should provide an isAndroidPhone method', ->
                Base.device.isAndroidPhone.should.be.a('function')

            it 'should provide an isAndroidTablet method', ->
                Base.device.isAndroidTablet.should.be.a('function')

            it 'should provide an isAndroidDevice method', ->
                Base.device.isAndroidDevice.should.be.a('function')

            it 'should provide an isWindowsPhone method', ->
                Base.device.isWindowsPhone.should.be.a('function')

            it 'should provide an isWindowsTablet method', ->
                Base.device.isWindowsTablet.should.be.a('function')

            it 'should provide an isWindowsDevice method', ->
                Base.device.isWindowsDevice.should.be.a('function')






