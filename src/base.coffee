((root, factory) ->

    _ = require('underscore')

    module.exports = factory(root, _, exports)

)(this, (root, _, Base) ->


    # Promise abstraction

    # DOM manipulation

    # Utils
    Base.util = 
        each: $.each,
        extend: $.extend,
        uniq: _.uniq,
        _: _
)