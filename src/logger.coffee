((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Logger) ->

    # Logger
    loglevel = require('loglevel')

    # Expose the Logger API
    Logger =

        setLevel: (level) ->
            loglevel.setLevel(level)

        trace: (msg) ->
            loglevel.trace(msg)

        debug: (msg) ->
            loglevel.debug(msg)

        info: (msg) ->
            loglevel.info(msg)

        warn: (msg) ->
            loglevel.warn(msg)

        error: (msg) ->
            loglevel.error(msg)

    return Logger
)