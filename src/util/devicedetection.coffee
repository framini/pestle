((root, factory) ->

    module.exports = factory(root, {})

)(window, (root, DeviceDetection) ->

    # Device detection
    isMobile = require('ismobilejs')

    # Expose device detection API
    DeviceDetection =

        # Groups
        isMobile: () ->
            isMobile.phone

        isTablet: () ->
            isMobile.tablet

        # Apple devices
        isIphone: () ->
            isMobile.apple.phone

        isIpod: () ->
            isMobile.apple.ipod

        isIpad: () ->
            isMobile.apple.tablet

        isApple : () ->
            isMobile.apple.device

        # Android devices
        isAndroidPhone: () ->
            isMobile.android.phone

        isAndroidTablet: () ->
            isMobile.android.tablet

        isAndroidDevice: () ->
            isMobile.android.device

        # Windows devices
        isWindowsPhone: () ->
            isMobile.windows.phone

        isWindowsTablet: () ->
            isMobile.windows.tablet

        isWindowsDevice: () ->
            isMobile.windows.device

    return DeviceDetection
)