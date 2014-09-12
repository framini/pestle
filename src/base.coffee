((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Base) ->

    # Promise abstraction

    # DOM manipulation

    # Logger
    Base.log = require './logger.coffee'

    # Device detection
    Base.device = require './devicedetection.coffee'

    # Cookies API
    Base.cookies = require './cookies.coffee'

    # Viewport detection
    Base.vp = require './viewportdetection.coffee'

    # Function that is gonna handle responsive images
    Base.Imager = require 'imager.js'

    # Utils
    # Libraries like underscore, backbone, will be loaded by the project
    # as hard dependencies for this layer
    # TODO: Make something with this. As it is, is useless
    Base.util =
        each: $.each,
        extend: $.extend,
        uniq: root._.uniq,
        _: root._
        string:
            capitalize: (str) ->
                str = (if not str? then "" else String(str))
                str.charAt(0).toUpperCase() + str.slice(1)

    return Base
)