

//Preloader
$(window).on('load', function () { // makes sure the whole site is loaded 
    $('#status').fadeOut(); // will first fade out the loading animation 
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
    $('body').delay(350).css({ 'overflow': 'visible' });
})

$(document).ready(function () {

    showAllRecord();
    $("#btn-search").click(function () {
        $("#searchModal").show();
    });

    $("#btn-close").click(function () {
        $("#searchModal").hide();
    });


    // Insert Person

    let insetPersonal = document.querySelector('#insertPersonnel');

    $(insetPersonal).click(function () {
        console.log('person button clikced')
        $('#personnelCreate').show();
    });

});


// function to show all records in a Person Department and Location Table
function showAllRecord() {
    $.ajax({
        url: 'php/getAll.php',
        type: 'POST',
        datatype: 'json',
        success: function (allResult, textStatus) {
            //console.log(textStatus);
            if (textStatus == 'success') {
                let jsondata = JSON.stringify(allResult);
                let finalData = JSON.parse(jsondata);
                // console.log(finalData);
                finalData.forEach(function (d) {
                    let fName = d.firstName;
                    let lName = d.lastName;
                    let email = d.email;
                    let deptName = d.department;
                    let locName = d.location;
                    // console.log(locName);
                    //  console.log(deptName);
                    appendPersonelData(fName, lName, email, deptName, locName);
                    appenedDeptData(deptName, locName);
                    appenedLocation(locName);
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}






// Function to show all Data in Perosn Tablle
function appendPersonelData(fName, lName, email, locName, deptName) {
    $('#tablePersonel').append(

        $("<tr>").append(
            $("<td>").text(fName + ", " + lName),
            $("<td>").text(email),
            $("<td>").text(deptName),
            $("<td>").text(locName),
            $("<td>").html('<i class="fas fa-edit edit edit-personel"></i>'),
            $("<td>").html('<i class="fas fa-trash-alt delete-person"></i>')
        )
        // "<tr>" +
        // "<td>" + fName + ", " + lName + "</td>" +
        // "<td>" + email + "</td>" +
        // "<td>" + deptName + "</td>" +
        // "<td>" + locName + "</td>" +
        // "<td>" + "EI" + "</td>" +
        // "<td>" + "DI" + "</td>" +
        // +"</tr>"
    );

}
// Function to show all Data in Department Tablle
const appenedDeptData = (deptName, locName) => {

    $('#tableDepartment').append(
        $('<tr>').append(
            $("<td>").text(deptName),
            $("<td>").text(locName),
            $("<td>").html('<i class="fas fa-edit edit edit-dept"></i>'),
            $("<td>").html('<i class="fas fa-trash-alt delete-dept"></i>')
        )
    );
}

// Function to show all Data in Location Table

const appenedLocation = (locName) => {

    $('#tableLocation').append(
        $('<tr>').append(
            $("<td>").text(locName),
            $("<td>").html('<i class="fas fa-edit edit edit-location"></i>'),
            $("<td>").html('<i class="fas fa-trash-alt delete-location"></i>')
        )
    )

}