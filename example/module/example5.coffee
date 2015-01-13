module.exports =

    events:
        'click .boton': 'customHandler'

    # constructor
    initialize : () ->

        @log = @sandbox.log

        @log.info "Example 5 initialized"

        $(@options.el).find('.title').html(@options.title)

    customHandler: () ->

        @log.info "I'm going to erase the element!"

        @stop()