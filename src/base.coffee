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

    # Utils
    # Libraries like underscore, backbone, will be loaded by the project
    # as hard dependencies for this layer
    # TODO: Make something with this. As it is, is useless
    Base.util =
        each: $.each,
        extend: $.extend,
        uniq: root._.uniq,
        _: root._

    return Base
)