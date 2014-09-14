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

            _.bindAll @, "_init",
                         "_createListeners",
                         "_createInstance"

            @config = Base.util._.extend {}, @cfg, config

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
            Backbone.on 'responsiveimages:create', @_createInstance

        _createInstance : (options = {}) ->

            Base.log.info "[ext] Responsive Images Extension creating a new Imager instance"

            new Base.Imager( options.selector or @config.defaultSelector,
                availableWidths: options.availableWidths or @config.availableWidths,
                availablePixelRatios: options.availablePixelRatios or @config.availablePixelRatios
            )

    # returns an object with the initialize method that will be used to
    # init the extension
    initialize : (app) ->

        Base.log.info "[ext] Responsive Images Extension initialized"

        config = {}

        # Check if the extension has a custom config to use
        if app.config.extension and app.config.extension[@optionKey]
            config = Base.util._.defaults {}, app.config.extension[@optionKey]

        new ResponsiveImages(config)

    name: 'Responsive Images Extension'

    # The exposed key name that could be used to pass options
    # to the extension.
    # This is gonna be used when instantiating the Core object.
    # Note: By convention we'll use the filename
    optionKey: 'responsiveimages'
)