((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Base) ->

    # Promise abstraction

    # DOM manipulation

    # Logger
    Base.log = require('loglevel')

    # Device detection
    Base.device = require('ismobilejs')

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