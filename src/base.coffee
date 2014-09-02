((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Base) ->

    # Promise abstraction

    # DOM manipulation

    # Logger
    Base.log = require './logger.coffee'

    # Device detection
    Base.device = require './devicedetection.coffee'

    # Utils
    # Libraris like underscore, backbone, will be loaded by the project
    # as hard dependencies for this layer
    Base.util =
        each: $.each,
        extend: $.extend,
        uniq: root._.uniq,
        _: root._

    return Base
)