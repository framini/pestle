Base = require '../../src/base.coffee'
ExtManager = require '../../src/util/extmanager.coffee'
Core = require '../../src/core.coffee'

describe 'Core', ->

    core = new Pestle.Core(
        debug:
            logLevel: 5

        extension:
            "ext_deact" :
                activated : false
    )

    ext =
        initialize: sinon.spy (app) ->

            app.sandbox.bar = 'foo'

        afterAppStarted: sinon.spy()

        afterAppInitialized: sinon.spy()

        optionKey: 'ext'

        name: "Testing Extension"

    ext2 =
        initialize: sinon.spy (app) ->

            app.sandbox.foo = 'bar'

        afterAppStarted: sinon.spy()

        afterAppInitialized: sinon.spy()

        optionKey: 'ext2'

        name: "Testing Extension 2"

    ext_deact =
        initialize: sinon.spy (app) ->

            app.sandbox.bar = 'foo'

        afterAppStarted: sinon.spy()

        afterAppInitialized: sinon.spy()

        optionKey: 'ext_deact'

        name: "Second Testing Extension"

    core.addExtension(ext)
    core.addExtension(ext2)
    core.addExtension(ext_deact)

    it 'should use Pestle as the global object', ->
        Pestle.should.be.an 'object'

    it 'should define the \'modules\' namespace', ->
        Pestle.modules.should.be.an 'object'

    it 'should have a Core class', ->
        Pestle.Core.should.be.a 'function'

    it 'should provide "platform" as the default namespace', ->
        core.config.namespace.should.be.equal 'platform'

    it 'shoul provide a default logging level between 0 and 5', ->
        core.config.debug.logLevel.should.be.at.least(0).and.below(6)

    it 'should have a setConfig Method', ->
        core.setConfig.should.be.a 'function'

    it 'should have a setComponentConfig Method', ->
        core.setComponentConfig.should.be.a 'function'

    it 'should have a start Method', ->
        core.start.should.be.a 'function'

    it 'should have a getInitializedComponents Method', ->
        core.getInitializedComponents.should.be.a 'function'

    it.skip 'should have a stop Method', ->
        core.stop.should.be.a 'function'

    it 'should have a addExtension Method', ->
        core.addExtension.should.be.a 'function'

    describe 'setting up Pestle', ->

        it 'should only accept objects as a parameter', ->
            state2 = () => core.setConfig('string')
            state2.should.throw(Error)

            state = () => core.setConfig(2)
            state.should.throw(Error)

            state = () => core.setConfig(undefined)
            state.should.throw(Error)

            state = () => core.setConfig({})
            state.should.not.throw(Error)

        it 'should overwrite values passed during the instantiation of Pestle', ->
            logLevel = core.config.debug.logLevel
            core.setConfig({
                debug:
                    logLevel: 2
            })
            logLevel.should.not.be.equal core.config.debug.logLevel

    describe 'starting the app', ->

        compsExt = core.extManager.getExtensionByName('components')
        rwdExt = core.extManager.getExtensionByName('responsivedesign')
        respimgExt = core.extManager.getExtensionByName('responsiveimages')

        # attach some spies before starting the app
        sinon.spy(compsExt[0], "initialize")
        sinon.spy(rwdExt[0], "initialize")
        sinon.spy(respimgExt[0], "initialize")

        # starts the app
        before -> core.start()

        it 'should throw an error if an extension is added after the Core has been started', ->
            state = () => core.addExtension( initialize: () -> )
            state.should.throw(Error)

        it 'should change its state of started to true', ->
            core.started.should.be.equal true

        it 'should load the Components extension by default', ->
            compsExt.length.should.be.equal 1

        it 'should initialize the Components extension by default', ->
            compsExt[0].initialize.should.have.been.called
            compsExt[0].initialize.restore()

        it 'should load the ResponsiveDesign extension by default', ->
            rwdExt.length.should.be.equal 1

        it 'should initialize the ResponsiveDesign extension by default', ->
            rwdExt[0].initialize.should.have.been.called
            rwdExt[0].initialize.restore()

        it 'should load the ResponsiveImages extension by default', ->
            respimgExt.length.should.be.equal 1

        it 'should initialize the ResponsiveImages extension by default', ->
            respimgExt[0].initialize.should.have.been.called
            respimgExt[0].initialize.restore()

    describe 'Extension Manager', ->

        it 'should have an instance of the extension manager', ->
            core.extManager.should.be.an.instanceOf(ExtManager)

        it 'should call the initialize method on activated extension', ->
            ext.initialize.should.have.been.called

        it 'should NOT call the initialize method on deactivated extension', ->
            ext_deact.initialize.should.not.have.been.called

        it 'should NOT call the afterAppStarted method on deactivated extension', ->
            ext_deact.afterAppStarted.should.not.have.been.called

        it 'should NOT call the afterAppInitialized method on deactivated extension', ->
            ext_deact.afterAppInitialized.should.not.have.been.called

        it 'should pass the core as an argument to the initialize method for extensions', ->
            ext.initialize.should.have.been.calledWith(core)

        it 'should call the after afterAppStarted on each extension', ->
            ext.afterAppStarted.should.have.been.called

        it 'should call the afterAppInitialized method (if any) after the afterAppStarted method', ->
            ext.afterAppInitialized.should.have.been.calledAfter ext.afterAppStarted
            ext.afterAppInitialized.should.have.been.calledAfter ext2.afterAppStarted

            ext2.afterAppInitialized.should.have.been.calledAfter ext.afterAppStarted
            ext2.afterAppInitialized.should.have.been.calledAfter ext2.afterAppStarted

    describe 'Pestle Event Bus', ->

        describe 'Suscribing methods', ->

            it 'should provide an \'addListener\' method', ->
                Pestle.addListener.should.be.a 'function'

            it 'should provide an \'addOnceListener\' method', ->
                Pestle.addOnceListener.should.be.a 'function'

            it 'should provide an \'on\' method', ->
                Pestle.on.should.be.a 'function'

            it 'should provide an \'once\' method', ->
                Pestle.once.should.be.a 'function'

        describe 'Defining events methods', ->

            it 'should provide an \'defineEvent\' method', ->
                Pestle.defineEvent.should.be.a 'function'

            it 'should provide an \'defineEvents\' method', ->
                Pestle.defineEvents.should.be.a 'function'

        describe 'Removing events methods', ->

            it 'should provide an \'removeEvent\' method', ->
                Pestle.removeEvent.should.be.a 'function'

        describe 'Unscribing methods', ->

            it 'should provide an \'removeListener\' method', ->
                Pestle.removeListener.should.be.a 'function'

            it 'should provide an \'off\' method', ->
                Pestle.off.should.be.a 'function'

        describe 'Bulk suscribing methods', ->

            it 'should provide an \'addListeners\' method', ->
                Pestle.addListeners.should.be.a 'function'

        describe 'Bulk unsuscribing methods', ->

            it 'should provide an \'removeListeners\' method', ->
                Pestle.removeListeners.should.be.a 'function'

        describe 'Triggering methods', ->

            it 'should provide an \'emitEvent\' method', ->
                Pestle.emitEvent.should.be.a 'function'

            it 'should provide an \'trigger\' method', ->
                Pestle.trigger.should.be.a 'function'

            it 'should provide an \'emit\' method', ->
                Pestle.emit.should.be.a 'function'


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

        describe 'Cookies', ->

            it 'should have Cookies handler available', ->
                Base.should.have.property('cookies')

            it 'should be available within sandboxes', ->
                sb = core.createSandbox 'test'
                sb.should.have.property 'cookies'

            it 'should provide a set method', ->
                Base.cookies.set.should.be.a('function')

            it 'should provide a get method', ->
                Base.cookies.get.should.be.a('function')

            it 'should provide a expire method', ->
                Base.cookies.expire.should.be.a('function')

        describe 'Viewport detection', ->

            it 'should have Viewport detector available', ->
                Base.should.have.property('vp')

            it 'should be available within sandboxes', ->
                sb = core.createSandbox 'test'
                sb.should.have.property 'vp'

            it 'should provide a viewportW method', ->
                Base.vp.viewportW.should.be.a('function')

            it 'should provide a viewportH method', ->
                Base.vp.viewportH.should.be.a('function')

            it 'should provide a viewport method', ->
                Base.vp.viewport.should.be.a('function')

            it 'should provide a inViewport method', ->
                Base.vp.inViewport.should.be.a('function')

            it 'should provide a inX method', ->
                Base.vp.inX.should.be.a('function')

            it 'should provide a inY method', ->
                Base.vp.inY.should.be.a('function')

            it 'should provide a scrollX method', ->
                Base.vp.scrollX.should.be.a('function')

            it 'should provide a scrollY method', ->
                Base.vp.scrollY.should.be.a('function')

            it 'should provide a mq method', ->
                Base.vp.mq.should.be.a('function')

            it 'should provide a rectangle method', ->
                Base.vp.rectangle.should.be.a('function')

            it 'should provide a aspect method', ->
                Base.vp.aspect.should.be.a('function')
