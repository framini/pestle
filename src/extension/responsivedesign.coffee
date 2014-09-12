###*
 * This extension will be triggering events once the Device in which the
 * user is navigating the site is detected. Its fucionality mostly depends
 * on the configurations settings (provided by default, but they can be overriden)
###
((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    Base = require('./../base.coffee')

    class ResponsiveDesign

        cfg :
            # This limit will be used to make the device detection
            # when the user resize the window
            waitLimit: 300

            # defines if we have to listen for the resize event on the window obj
            windowResizeEvent: true

            # Default breakpoints
            breakpoints : [
                    name: "mobile"
                    # until this point will behaves as mobile
                    bpmin: 0
                    bpmax: 767
                ,
                    name: "tablet"
                    bpmin: 768
                    bpmax: 959
                ,
                    # by default anything greater than tablet is a desktop
                    name: "desktop"
                    bpmin: 960
            ]

        constructor: (config = {}) ->

            _.bindAll @, "_init",
                         "detectDevice",
                         "_checkViewport",
                         "_attachWindowHandlers"

            @config = Base.util._.defaults config, @cfg

            @_init()

        _init: () ->

            @_attachWindowHandlers() if @config.windowResizeEvent

            @detectDevice()

        _attachWindowHandlers: () ->

            lazyResize = _.debounce @detectDevice, @config.waitLimit

            $(window).resize(lazyResize)

        detectDevice: () ->

            bp = @config.breakpoints

            vp = Base.vp.viewportW()

            # get a reference (if any) to the corresponding breakpoint
            # defined in the config.
            vpd = @_checkViewport(vp, bp)

            if not _.isEmpty vpd

                capitalizedBPName = Base.util.string.capitalize(vpd.name)
                
                # let's fist check if we have a method to detect the device through UA
                if _.isFunction Base.device['is' + capitalizedBPName]
                    UADetector = Base.device['is' + capitalizedBPName]

                # variable that holds the result of a UA check.
                # Unless there is a method to check the UA, lets
                # leave it as false and use only the viewport to
                # make the device detection
                stateUA = false
                if _.isFunction UADetector

                    stateUA = UADetector()

                # Final check. First we'll try to make to make the decision
                # upon the current device based on UA, if is not possible, lets just
                # use the viewport
                if stateUA or vpd.name
                    # Trigger a event that follows the following naming convention
                    # rwd:<device>
                    # Example: rwd:tablet or rwd:mobile

                    evt = 'rwd:' + vpd.name.toLowerCase()

                    Base.log.info "[ext] Responsive Design extension is triggering the following"
                    Base.log.info evt

                    Backbone.trigger evt

            else
                msg = "[ext] The passed settings to the Responsive Design Extension " +
                          "might not be correct since we haven't been able to detect an " +
                          "asociated breakpoint to the current viewport"
                Base.log.warn msg

        ###*
         * detect if the current viewport
         * correspond to any of the defined bp in the config setting
         * @param  {[type]} vp [number. Current viewport]
         * @param  {[type]} breakpoints [clone of the breakpoint key object]
         * @return {[type]} the breakpoint that corresponds to the currently
         *                  detected viewport
        ###
        _checkViewport: (vp, breakpoints) ->

            breakpoint = _.filter(breakpoints, (bp) ->

                # starts checking if the detected viewport is
                # bigger than the bpmin defined in the current
                # iterated breakpoint
                if vp >= bp.bpmin

                    # we'll need to check this way because by default
                    # if a BP doesn't have a bpmax property it means
                    # is the last and bigger case to check. By default
                    # is desktop
                    if bp.bpmax and bp.bpmax != 0

                        # if it's within the range, all good
                        if vp <= bp.bpmax
                            return true
                        else
                            return false

                    else
                        # this should only be true in only one case
                        # By default, just for desktop which doesn't have
                        # an "until" breakpoint
                        return true

                else
                    false

            )

            if breakpoint.length > 0
                return breakpoint.shift()
            else
                return {}


    # returns an object with the initialize method that will be used to
    # init the extension
    initialize : (app) ->

        Base.log.info "[ext] Responsive Design Extension initialized"

        config = {}

        # Check if the extension has a custom config to use
        if app.config.extension and app.config.extension[@optionKey]
            config = Base.util._.defaults {}, app.config.extension[@optionKey]

        new ResponsiveDesign(config)

    name: 'Responsive Design Extension'

    # The exposed key name that could be used to pass options
    # to the extension.
    # This is gonna be used when instantiating the Core object.
    # Note: By convention we'll use the filename
    optionKey: 'responsivedesign'
)