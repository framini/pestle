module.exports =
    myLibAsUMD:
        template: "UMD", # default, can be ommited
        path: "src/",
        dstPath: "dist/umdLib"

    _defaults:
        debugLevel:90,
        verbose: true,
        scanAllow: true,
        allNodeRequires: true,
        noLoaderUMD: true

        bundle:
            path: "src/"
            dependencies: exports: bundle:
                lodash: ['_']
                core: ['./core']