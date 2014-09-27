((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, Utils) ->

    # Expose Utils API
    Utils =

        ###*
         * Function to compare library versioning
        ###
        versionCompare : (v1, v2, options) ->

            isValidPart = (x) ->
                ((if lexicographical then /^\d+[A-Za-z]*$/ else /^\d+$/)).test x

            lexicographical = options and options.lexicographical
            zeroExtend = options and options.zeroExtend
            v1parts = v1.split(".")
            v2parts = v2.split(".")

            return NaN if not v1parts.every(isValidPart) or not v2parts.every(isValidPart)

            if zeroExtend
                v1parts.push "0"    while v1parts.length < v2parts.length
                v2parts.push "0"    while v2parts.length < v1parts.length

            unless lexicographical
                v1parts = v1parts.map(Number)
                v2parts = v2parts.map(Number)

            i = -1
            while i < v1parts.length
                i++
                return 1 if v2parts.length < i
                if v1parts[i] == v2parts[i]
                    continue
                else if v1parts[i] > v2parts[i]
                    return 1
                else
                    return -1

            return -1 if v1parts.length != v2parts.length

            return 0

    return Utils
)