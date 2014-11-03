module.exports = NGS.Module.add 'Example1',

    events:
        'click .boton': 'customHandler'

    # constructor
    initialize : () ->

        log = @sandbox.log

        log.info "Example 1 initialized"

        log.info @options

    customHandler: () ->
        @stop()

    render: (sa) ->
        log.info "Example 1 render method"