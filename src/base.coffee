###*
 * The purpose of this layer is to declare and abstract the access to
 * the core base of libraries that the rest of the stack (the app framework)
 * will depend.
 * @author Francisco Ramini <framini at gmail.com>
###
((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Base) ->

    # Array that holds hard dependencies for the SDK
    dependencies = [
            "name": "jQuery"
            "required": "1.10" # required version
            "obj": root.$ # global object
            "version": if root.$ then root.$.fn.jquery else 0 # gives the version number
                                                              # of the loaded lib
        ,
            "name": "Underscore"
            "required": "1.7.0" # required version
            "obj": root._ # global object
            "version": if root._ then root._.VERSION else 0
    ]

    # Version checker util
    VersionChecker = require './util/versionchecker.coffee'

    # In case any of our dependencies were not loaded, or its version doest not correspond to ours
    # needs, the versionChecker will thorw an error explaining why
    VersionChecker.check(dependencies)

    # Logger
    Base.log = require './util/logger.coffee'

    # Device detection
    Base.device = require './util/devicedetection.coffee'

    # Cookies API
    Base.cookies = require './util/cookies.coffee'

    # Viewport detection
    Base.vp = require './util/viewportdetection.coffee'

    # Function that is gonna handle responsive images
    Base.Imager = require 'imager.js'

    # Event Bus
    Base.Events = require './util/eventbus.coffee'

    # General Utils
    Utils = require './util/general.coffee'

    # Utils
    Base.util = root._.extend Utils, root._

    return Base
)