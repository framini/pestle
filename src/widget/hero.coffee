((root, factory) ->

    # Definition for AMD
    if typeof define is "function" and define.amd
        define [
            "../core"
            "exports"
        ], (Core, exports) ->
            factory(root, NGL, exports)


    # Definition as a global variable in case we dont use requirejs 
    else
        factory(root, root.NGL, {})

)(this, (root, NGL, Hero) ->

    NGL.Hero = () ->
        console.log("SOY UN HERO")


    return NGL
)