$(document).ready(function () {
    $("#btn-search").click(function () {
        console.log('i am clicked')
        $("#searchModal").show();
    });

    $(".close").click(function () {
        $("#searchModal").hide();
    });
});