require.config({
    paths: {
        jquery: '../vendor/jquery/jquery-3.0.0',
        utils: "./module/utils",
    }
})

define(['jquery'], function ($) {
    var page = $(".page-module").attr('data-module');
    require([`./${page}`], (module) => {
        module.init();  
    })
});