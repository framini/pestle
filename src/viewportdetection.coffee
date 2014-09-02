((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Viewport) ->

    # Logger
    viewport = require('verge')

    # Expose Viewport detection API
    Viewport =

        viewportW: () ->
            viewport.viewportW()

        viewportH: (key) ->
            viewport.viewportH()

        viewport: (key) ->
            viewport.viewport()

        inViewport: (el, cushion) ->
            viewport.inViewport(el, cushion)

        inX: (el, cushion) ->
            viewport.inX(el, cushion)

        inY: (el, cushion) ->
            viewport.inY(el, cushion)

        scrollX: () ->
            viewport.scrollX()

        scrollY: () ->
            viewport.scrollY()

        # To test if a media query is active
        mq: (mediaQueryString) ->
            viewport.mq(mediaQueryString)

        rectangle: (el, cushion) ->
            viewport.rectangle(el, cushion)

        # if no argument is passed, then it returns the aspect
        # ratio of the viewport. If an element is passed it returns
        # the aspect ratio of the element
        aspect: (o) ->
            viewport.aspect(o)

    return Viewport
)