((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Cookies) ->

    # Logger
    cookies = require('cookies-js')

    # Expose Cookies API
    Cookies =

        set: (key, value, options) ->
            cookies.set key, value, options

        get: (key) ->
            cookies.get key

        expire: (key, options) ->
            cookies.expire key, options

    return Cookies
)