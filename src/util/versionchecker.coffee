((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, VersionChecker) ->

    log = require './logger.coffee'
    Utils = require './general.coffee'

    # Expose VersionChecker API
    VersionChecker =

        ###*
         * Recursive method to check versioning for all the defined libraries
         * within the dependency array
        ###
        check: (dependencies) ->

            if dependencies.length > 0

                dp = dependencies.shift()

                unless dp.obj
                    msg = dp.name + " is a hard dependency and it has to be loaded before pestle.js"
                    log.error msg
                    throw new Error(msg)

                # compare the version
                unless Utils.versionCompare(dp.version, dp.required) >= 0
                    # if we enter here it means the loaded library doest not fulfill our needs
                    msg = "[FAIL] " + dp.name + ": version required: " + dp.required +
                          " <--> Loaded version: " + dp.version
                    log.error msg
                    throw new Error(msg)

                VersionChecker.check(dependencies)


    return VersionChecker
)