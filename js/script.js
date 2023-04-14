

//Preloader
$(window).on('load', function () { // makes sure the whole site is loaded 
    $('#status').fadeOut(); // will first fade out the loading animation 
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website. 
    $('body').delay(350).css({ 'overflow': 'visible' });
})


let deptName;
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-right',
    timeOut: 2000 // set the timeOut option to 2000 milliseconds (2 seconds)
};

//as ko kha cal kr rhe ho ?



$(document).ready(function () {


    $("#btn-search").click(function () {
        $("#searchModal").show();
    });

    $("#btn-close").click(function () {
        $("#searchModal").hide();
    });

    //  Personnel
    personnel();
    location();
    department();


    const tables = document.querySelectorAll("table");

    tables.forEach((table) => {
        const table_rows = table.querySelectorAll("tbody tr");
        const table_headings = table.querySelectorAll("thead th");

        table_headings.forEach((head, i) => {
            let sort_asc = true;
            head.onclick = () => {
                table_headings.forEach((h) => h.classList.remove("active"));
                head.classList.add("active");

                table.querySelectorAll("td").forEach((td) => td.classList.remove("active"));
                table_rows.forEach((row) => {
                    row.querySelectorAll("td")[i].classList.add("active");
                });

                table_headings.forEach((h) => h.classList.remove("asc", "desc"));
                head.classList.toggle("asc", sort_asc);
                head.classList.toggle("desc", !sort_asc);
                sort_asc = !sort_asc;

                sortTable(table, i, sort_asc);
            };
        });

        function sortTable(table, column, sort_asc) {
            const tbody = table.querySelector("tbody");
            const rows = Array.from(tbody.querySelectorAll("tr"));

            const sortType = rows[0].querySelectorAll("td")[column].getAttribute("data-type");
            const sortDirection = sort_asc ? 1 : -1;


            rows.sort((rowA, rowB) => {
                const cellA = rowA.querySelectorAll("td")[column];
                const cellB = rowB.querySelectorAll("td")[column];

                return sortDirection * cellA.textContent.trim().localeCompare(cellB.textContent.trim());
            });

            tbody.innerHTML = "";
            rows.forEach((row) => tbody.appendChild(row));
        }
    });
});


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
                    let id = d.id;
                    let fName = d.firstName;
                    let lName = d.lastName;
                    let email = d.email;
                    let jobTitle = d.jobTitle;
                    deptName = d.department;
                    let locName = d.location;
                    // console.log(locName);
                    //  console.log(deptName);
                    personnelTablerecord(id, fName, lName, email, jobTitle, deptName, locName);
                });
                editPersonnel();
                delPersonnel();
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
                $('.locationSel').append(
                    '<option value="" selected="true" disabled>Choose a Department</option>');
                locList.forEach(function (l) {
                    let loc = l.name;
                    //yahan value milti hai or log  bhoti hai
                    // console.log("Location", loc);
                    locationTableRecord(loc)
                    $('.locationSel').append($('<option>', {
                        value: l.id,
                        text: l.name
                    }));
                });
                editLocation();
                delLocation();
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
                    let depLoc = d.location;
                    deptTableRecord(dep, depLoc);
                    // console.log(depLoc);
                    // deptTableRecord(dep, loc);
                    $('.departmentSel').append($('<option>', {
                        value: d.id,
                        text: dep
                    }));
                    editDeptartment();
                    delDepartment();
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown, textStatus);
        }

    });

}

// Formet Input into Capital
function uperCase(str) {

    var splitStr = str.toLowerCase().split(' ');
    //  console.log(splitStr);
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        //    console.log(splitStr);
    }
    // console.log(splitStr);
    return splitStr.join(' ');

}


//Personnøel
function personnel() {
    getAllPersonnel();
    insetPersoennl();
    // editPersonnel();
}



// Function to show all Data in Perosn Tablle
function personnelTablerecord(id, fName, lName, email, jobTitle, locName, deptName) {
    $('#tablePersonel').append(

        $("<tr>").append(
            $("<td style='display: none;'>").text(id),

            $("<td>").text(fName + ", " + lName),
            $("<td>").text(jobTitle),
            $("<td>").text(email),
            $("<td>").text(deptName),
            $("<td>").text(locName),
            $("<td>").html('<i class="fas fa-edit edit edit-personel"></i>'),
            $("<td>").html('<i class="fas fa-trash-alt delete-personel"></i>')
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

//making click linstner on edit
//ni ho gaye 



//Insert Personal
let insetPersoennl = () => {
    let insetPersoennl = document.querySelector('#insertPersonnel');
    let cancelPersonnelInsert = document.querySelector('#cancelPersonnelInsert');

    let personnelModal = document.querySelector('#personnelCreate');

    $(insetPersoennl).click(function () {
        //  console.log('person button clicked')
        $(personnelModal).show();
        $('#persCreate').submit(function (event) {
            event.preventDefault();
            //console.log('Insert Method Executed');
            let fName = uperCase($('#firstNameCreate').val());
            let lName = uperCase($('#lastNameCreate').val());
            let jobTitle = uperCase($('#jobTitleCreate').val());
            let email = $('#emailCreate').val();
            let dID = $('#departmentSelInsert').val();
            //  console.log(fName, lName, email, dID);

            $.ajax({
                url: './php/insertPersonnel.php',
                type: 'POST',
                datatype: 'json',
                data: {
                    firstName: fName,
                    lastName: lName,
                    jobTitle: jobTitle,
                    email: email,
                    departmentID: dID
                },
                success: function (result) {
                    //console.log('Success');
                    // console.log(result.message);

                    toastr.success(result.message);
                    $(personnelModal).hide();
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                },
                error: function (xhr, status, error) {
                    console.log(error);
                    toastr.error('An error occurred while inserting location.');
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

    // $('.edit-personel').click(function () {
    //     //console.log('edit button clicked');
    //     $('#personnelEdit').modal('show');
    // });

    $(document).on("click", ".edit-personel", function () {
        var row = $(this).closest("tr");

        var id = row.attr("id");
        // console.log("id is" + id);
        var fullName = row.find("td:nth-child(2)").text();
        var lName = fullName.split(",")[1].trim();
        var fName = fullName.split(",")[0].trim();
        var jobTitle = row.find("td:nth-child(3)").text();
        var email = row.find("td:nth-child(4)").text();

        $('#firstName').val(fName);
        $('#lastName').val(lName);
        $('#jobTitle').val(jobTitle);
        $('#email').val(email);
        $('.persName').val(fullName);
        $('#personnelEdit').modal('show');
        $('#edit-personnel-id').val(id);
    });

    $("#persUpdate").submit(function (event) {
        event.preventDefault();
        var pId = $('#edit-personnel-id').val();
        console.log(pId);

        $.ajax({
            url: 'php/editPersonnel.php',
            type: 'POST',
            datatype: 'json',
            data: {
                id: pId,
                firstName: uperCase($('#firstName').val()),
                lastName: uperCase($('#lastName').val()),
                jobTitle: uperCase($('#jobTitle').val()),
                email: $('#email').val(),
                departmentID: $('#departmentSelEdit').val(),
            },
            success: function (result) {
                console.log('Success');
                toastr.success(result.message);
                $('#personnelEdit').modal('hide');
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            error: function (xhr, status, error) {
                console.log(error);
                toastr.error('An error occurred while Editing Person.');
            }
        });
    });

}

//Delete Pernonnel
function delPersonnel() {
    $('.delete-personel').click(function () {
        // console.log('edit button clicked');
        $('#personnelDel').modal('show');
    });
}


// Department
function department() {
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

        $('#deptCreate').submit(function (event) {
            event.preventDefault();
            $.ajax({
                url: 'php/insertDept.php',
                datatype: 'json',
                type: 'POST',
                data: {
                    name: uperCase($('#departmentCreateName').val()),
                    locationID: $('#locationSelInsert').val(),
                },
                success: function (result) {
                    //console.log('Success');
                    // console.log(result.message);

                    toastr.success(result.message);
                    $(deptModal).hide();
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                },
                error: function (xhr, status, error) {
                    console.log(error);
                    toastr.error('An error occurred while inserting Department.');
                }
            });
            // return false;
        });

    });

    $(cancelDept).click(function () {
        $(deptModal).hide();
    });
}

function editDeptartment() {
    $('.edit-dept').click(function () {
        // console.log('edit button clicked');
        $('#departmentEdit').modal('show');

    });
}

function delDepartment() {
    $('.delete-dept').click(function () {
        // console.log('edit button clicked');
        $('#departmentDel').modal('show');

    });
}



// Location

function location() {
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
    );



}
const insertLocation = () => {

    let locModal = document.querySelector('#locationCreate');
    let insertLoc = document.querySelector('#insertLocation');
    let cancelLoc = document.querySelector('.cancelLoc');

    $(insertLoc).click(function () {
        // console.log('i am clicked');
        $(locModal).show();

        $('#locCreate').submit(function (event) {
            event.preventDefault();
            $.ajax({
                url: 'php/insertLocation.php',
                type: 'POST',
                datatype: 'json',
                data: {
                    name: uperCase($('#locationCreateName').val())
                },
                success: function (result) {
                    //console.log('Success');
                    // console.log(result.message);
                    toastr.success(result.message);
                    $(locModal).hide();
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                },
                error: function (xhr, status, error) {
                    console.log(error);
                    toastr.error('An error occurred while inserting location.');
                }
            });
        });
    });

    $(cancelLoc).click(function () {
        $(locModal).hide();
    })

}

const editLocation = () => {
    $('.edit-location').click(function () {

        // console.log('edit button clicked');
        $('#locationEdit').modal('show');

    });
}
const delLocation = () => {
    $('.delete-location').click(function () {
        // console.log('edit button clicked');
        $('#locationDel').modal('show');
    });
}