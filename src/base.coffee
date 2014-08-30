((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Base) ->

    # Promise abstraction

    # DOM manipulation

    # Logger
    # loglevel is small enough to be part of the dist
    Base.log = require('loglevel')

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