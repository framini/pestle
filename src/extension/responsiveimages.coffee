###*
 * This extension will be handling the creation of the responsive images
###
((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Ext) ->

    Base = require('./../base.coffee')

    class ResponsiveImages

        cfg :
            # Array of supported Pixel width for images
            availableWidths: [133,152,162,225,210,224,280,352,470,536,590,676,710,768,885,945,1190]

            # Array of supporter pixel ratios
            availablePixelRatios: [1, 2, 3]

            # Selector to be used when instanting Imager
            defaultSelector : '.delayed-image-load'

            # lazy mode enabled
            lazymode : true

        constructor: (config = {}) ->

            Base.util.bindAll @, "_init",
                         "_createListeners",
                         "_createInstance"

            @config = Base.util.extend {}, @cfg, config

            @_init()

        _init: () ->

            # creates listeners to allow the instantiaton of the Imager
            # in lazy load mode.
            # Useful for infinite scrolls or images created on demand
            @_createListeners() if @config.lazymode

            # As soon as this extension is initialized we are gonna be creating
            # the responsive images
            @_createInstance()

        _createListeners: () ->
            # this gives the ability to create responsive images
            # by trigger this event with optional attributes
            Pestle.on 'responsiveimages:create', @_createInstance

        _createInstance : (options = {}) ->

            Base.log.info "[ext] Responsive Images Extension creating a new Imager instance"

            selector = options.selector or @config.defaultSelector
            opts = if not Base.util.isEmpty options then options else @config

            new Base.Imager(selector, opts)

    # returns an object with the initialize method that will be used to
    # init the extension
    initialize : (app) ->

        Base.log.info "[ext] Responsive Images Extension initialized"

        config = {}

        # Check if the extension has a custom config to use
        if app.config.extension and app.config.extension[@optionKey]
            config = Base.util.defaults {}, app.config.extension[@optionKey]

        app.sandbox.responsiveimages = () ->

            rp = new ResponsiveImages(config)

            # trigger the event to let everybody knows that this extension finished
            # its initialization
            Pestle.emit 'responsiveimages:initialized'

    # this method is meant to be executed after components have been
    # initialized
    afterAppInitialized: (app) ->

        Base.log.info "afterAppInitialized method from ResponsiveImages"

        app.sandbox.responsiveimages()


    name: 'Responsive Images Extension'

    # The exposed key name that could be used to pass options
    # to the extension.
    # This is gonna be used when instantiating the Core object.
    # Note: By convention we'll use the filename
    optionKey: 'responsiveimages'
)
