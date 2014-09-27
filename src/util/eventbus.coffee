((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, EventBus) ->

    EventEmitter = require('wolfy87-eventemitter')

    ###*
     * class that serves as a facade for the EventEmitter class
    ###
    class EventBus extends EventEmitter

    return EventBus
)