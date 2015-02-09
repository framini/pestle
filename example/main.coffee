# If we are under a browserify env, we could define modules in separate
# files and just require them in our main file
require './module/example1.coffee'

# we can still use the old way of defining modules, but not sure
# if we should keep it TBH
Pestle.modules.Example2 =
    initialize: () ->
        console.log "Second example"

# New way of adding modules definitions
Pestle.Module.add 'Example3',
    initialize: () ->
        console.log "Third example"

# Example of extending a module's definition
Pestle.Module.extend 'Example4',
    initialize: () ->
        @_super_()
        console.log "Forth example"
        console.log @options
    , 'Example3'

# Example of defining the behavior in a separate file
example5 = require './module/example5.coffee'
Pestle.Module.add 'Example5', example5
