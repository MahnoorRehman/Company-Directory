

//Preloader
$(window).on('load', function () { // makes sure the whole site is loaded 
    $('#status').fadeOut(); // will first fade out the loading animation 
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
    $('body').delay(350).css({ 'overflow': 'visible' });
})


let deptName;
let loc;

//as ko kha cal kr rhe ho ?



$(document).ready(function () {


    $("#btn-search").click(function () {
        $("#searchModal").show();
    });

    $("#btn-close").click(function () {
        $("#searchModal").hide();
    });

    //us variable ko start loading m value  mel rhe ha kia ?
    //us variable ko vaue kb assign ho


    //  Personnel
    personnel();

    //ya wala method ku found ni kr par hra m  ya locatoon wla
    location();

    department();

});
// $(document).on('click', '.edit-personel', function () {
//     $('#personnelEdit').show();

// });


// function to show all records in a Person 
function getAllPersonnel() {
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
                    let jobTitle = d.jobTitle;
                    deptName = d.department;
                    let locName = d.location;
                    // console.log(locName);
                    //  console.log(deptName);
                    personnelTablerecord(fName, lName, email, jobTitle, deptName, locName);
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }

    });
}



//get All Location
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
                    loc = l.name;
                    //yahan value milti hai or log  bhoti hai
                    // console.log("Location", loc);
                    locationTableRecord(loc)
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


//get All department
function getAllDept() {

    // console.log('Location value here', loc)
    $('.departmentSel').empty();

    $.ajax({
        url: 'php/getAllDept.php',
        type: 'POST',
        datatype: 'json',
        success: function (result, textStatus) {
            if (textStatus == 'success') {
                let jsondata = JSON.stringify(result);
                let deptList = JSON.parse(jsondata);
                $('.departmentSel').append('<option value="" selected="true" disabled>Choose a Department</option>');
                deptList.forEach(function (d) {
                    let dep = d.name;
                    let depLoc = d.locationID;


                    //  deptTableRecord(dep, loc);
                    console.log(depLoc);
                    // deptTableRecord(dep, loc);
                    $('.departmentSel').append($('<option>', {
                        value: d.id,
                        text: dep
                    }));
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown, textStatus);
        }

    });
}

//Personnøel
async function personnel() {
    getAllPersonnel();
    insetPersoennl();
    editPersonnel();
}



// Function to show all Data in Perosn Tablle
function personnelTablerecord(fName, lName, email, jobTitle, locName, deptName) {
    $('#tablePersonel').append(

        $("<tr>").append(
            $("<td>").text(fName + ", " + lName),
            $("<td>").text(jobTitle),
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

//Insert Personal
let insetPersoennl = () => {
    let insetPersoennl = document.querySelector('#insertPersonnel');
    let cancelPersonnelInsert = document.querySelector('#cancelPersonnelInsert');

    let personnelModal = document.querySelector('#personnelCreate');

    $(insetPersoennl).click(function () {


        console.log('person button clicked')
        $(personnelModal).show();


        $('#confirmPersCreate').click(function () {


            console.log('Insert Method Executed')

            $.ajax({
                url: './php/insertPersonnel.php',
                type: 'POST',
                datatype: 'json',
                data: {
                    firstName: $('#firstNameCreate').val(),
                    lastName: $('#lastNameCreate').val(),
                    jobTitle: $('#jobTitleCreate').val(),
                    email: $('#emailCreate').val(),
                    departmentID: $('#departmentSelInsert').val()
                },
                success: function (result) {
                    alert(result.message);
                }
            });
        });

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
async function department() {
    getAllDept();
    insertDepartment();
}

// Function to show all Data in Department Tablle
const deptTableRecord = (dep, loc) => {
    //  $('#tableDepartment').empty(); //
    $('#tableDepartment').append(
        $('<tr>').append(
            $("<td>").text(dep),
            $("<td>").text(loc),
            $("<td>").html('<i class="fas fa-edit edit edit-dept"></i>'),
            $("<td>").html('<i class="fas fa-trash-alt delete-dept"></i>')
        )
    );

}
function insertDepartment() {
    let insertDept = document.querySelector('#insertDepartment');
    let cancelDept = document.querySelector('.cancel-dept');

    let deptModal = document.querySelector('#departmentCreate')


    $(insertDept).click(function () {
        //  console.log('i am clicked');
        $(deptModal).show();

        $('#confirmDepCreate').click(function () {
            $.ajax({
                url: 'php/insertDept.php',
                datatype: 'json',
                type: 'POST',
                data: {
                    name: $('#departmentCreateName').val(),
                    locationID: $('#locationSelInsert').val(),
                },
                success: function (response) {
                    alert(response.message);
                },
                error: function (xhr, status, error) {
                    alert(xhr.responseText);
                }
            });
        });

    });

    $(cancelDept).click(function () {
        $(deptModal).hide();
    });
}



// Location

async function location() {
    getAllLoc();
    insertLocation();
}
// Function to show all Data in Location Table

const locationTableRecord = (loc) => {

    $('#tableLocation').append(
        $('<tr>').append(
            $("<td>").text(loc),
            $("<td>").html('<i class="fas fa-edit edit edit-location"></i>'),
            $("<td>").html('<i class="fas fa-trash-alt delete-location"></i>')
        )
    )

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