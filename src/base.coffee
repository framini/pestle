((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Base) ->

    _ = require('underscore')

    # Promise abstraction

    # DOM manipulation

    # Utils
    Base.util = 
        each: $.each,
        extend: $.extend,
        uniq: _.uniq,
        _: _
)