

//Preloader
$(window).on('load', function () { // makes sure the whole site is loaded 
    $('#status').fadeOut(); // will first fade out the loading animation 
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
    $('body').delay(350).css({ 'overflow': 'visible' });
})


let deptName;
$(document).ready(function () {

    showAllRecord();
    $("#btn-search").click(function () {
        $("#searchModal").show();
    });

    $("#btn-close").click(function () {
        $("#searchModal").hide();
    });


    //  Personnel
    personnel();
    department();
    location();
});
// $(document).on('click', '.edit-personel', function () {
//     $('#personnelEdit').show();

// });

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
                    deptName = d.department;
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


//get All department
function deptList() {
    $('.departmentSel').empty();

    $.ajax({
        url: 'php/getAllDept.php',
        type: 'POST',
        datatype: 'json',
        success: function (result, textStatus) {
            if (textStatus == 'success') {
                let jsondata = JSON.stringify(result);
                let deptList = JSON.parse(jsondata);
                // console.log(deptList);
                $('.departmentSel').append('<option value="" selected="true" disabled>Choose a Department</option>');
                deptList.forEach(function (d) {

                    $('.departmentSel').append($('<option>', {
                        value: d.id,
                        text: d.name
                    }));

                });

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown, textStatus);
        }

    });
}



//Personnel

function personnel() {
    insetPersoennl();
    editPersonnel();


}
//Insert Personal

const insetPersoennl = () => {
    let insetPersoennl = document.querySelector('#insertPersonnel');
    let cancelPersonnelInsert = document.querySelector('#cancelPersonnelInsert');

    let personnelModal = document.querySelector('#personnelCreate');

    $(insetPersoennl).click(function () {
        // console.log('person button clicked')
        $(personnelModal).show();


        //rest cod
        deptList();

    });
    $(cancelPersonnelInsert).click(function () {
        // console.log('person button clicked')
        $(personnelModal).hide();
    });
}

//Edit Personnel


const editPersonnel = () => {

    // let editPersonnel = document.querySelector('.edit-personel');

    // $('.edit-personel').click(function () {
    //     // console.log('edit button clicked');
    //     $('#personnelEdit').show();
    // });


}

//Delete Pernonnel



// Department

function getAllLoc() {
    $('.locationSel').empty();

    $.ajax({
        url: 'php/getAllLoc.php',
        type: 'POST',
        datatype: 'json',
        success: function (result, textStatus) {
            if (textStatus == 'success') {
                let jsondata = JSON.stringify(result);
                let locList = JSON.parse(jsondata);
                //  console.log(locList);
                $('.locationSel').append('<option value="" selected="true" disabled>Choose a Department</option>');
                locList.forEach(function (l) {
                    $('.locationSel').append($('<option>', {
                        value: l.id,
                        text: l.name
                    }));
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown, textStatus);
        }

    });
}


function department() {
    insertDepartment();
}


function insertDepartment() {
    let insertDept = document.querySelector('#insertDepartment');
    let cancelDept = document.querySelector('.cancel-dept');

    let deptModal = document.querySelector('#departmentCreate')


    $(insertDept).click(function () {
        //  console.log('i am clicked');
        $(deptModal).show();
    });

    $(cancelDept).click(function () {
        $(deptModal).hide();
    });

    getAllLoc();

}







// Location

function location() {
    insertLocation();
}

const insertLocation = () => {

    let locModal = document.querySelector('#locationCreate');
    let insertLoc = document.querySelector('#insertLocation');
    let cancelLoc = document.querySelector('.cancelLoc');

    $(insertLoc).click(function () {
        // console.log('i am clicked');
        $(locModal).show();
    });

    $(cancelLoc).click(function () {
        $(locModal).hide();
    })

}