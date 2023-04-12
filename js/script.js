

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

            // rows.sort((rowA, rowB) => {
            //     const cellA = rowA.querySelectorAll("td")[column];
            //     const cellB = rowB.querySelectorAll("td")[column];

            //     switch (sortType) {
            //         case "string":
            //             return sortDirection * cellA.textContent.trim().localeCompare(cellB.textContent.trim());
            //         case "number":
            //             return sortDirection * (Number(cellA.textContent) - Number(cellB.textContent));
            //         default:
            //             return 0;
            //     }
            // });
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
                    let loc = l.name;
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
                    let depLoc = d.location;
                    deptTableRecord(dep, depLoc);
                    // console.log(depLoc);
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

//making click linstner on edit
//ni ho gaye 

$(document).on("click", ".edit-personel", function () {
    var row = $(this).closest("tr");
    var fName = row.find("td:nth-child(1)").text();
    var lName = fName.split(",")[1].trim();
    fName = fName.split(",")[0].trim();
    var jobTitle = row.find("td:nth-child(2)").text();
    var email = row.find("td:nth-child(3)").text();
    var deptName = row.find("td:nth-child(4)").text();
    var locName = row.find("td:nth-child(5)").text();

    // create the dialog box
    var dialogBox = $("<div>").dialog({
        autoOpen: false,
        modal: true,
        title: "Edit Personnel",
        width: "500px",
        buttons: {
            "Save": function () {
                // save the edited data
                fName = $("#edit-fname").val().trim();
                lName = $("#edit-lname").val().trim();
                jobTitle = $("#edit-jobtitle").val().trim();
                email = $("#edit-email").val().trim();
                deptName = $("#edit-deptname").val().trim();
                locName = $("#edit-locname").val().trim();

                // update the row data
                row.find("td:nth-child(1)").text(fName + ", " + lName);
                row.find("td:nth-child(2)").text(jobTitle);
                row.find("td:nth-child(3)").text(email);
                row.find("td:nth-child(4)").text(deptName);
                row.find("td:nth-child(5)").text(locName);

                // close the dialog box
                $(this).dialog("close");
            },
            "Cancel": function () {
                // close the dialog box
                $(this).dialog("close");
            }
        }
    });

    // populate the dialog box with the current data
    dialogBox.append($("<label>").text("First Name:"));
    dialogBox.append($("<input>").attr("type", "text").attr("id", "edit-fname").val(fName));
    dialogBox.append($("<br>"));

    dialogBox.append($("<label>").text("Last Name:"));
    dialogBox.append($("<input>").attr("type", "text").attr("id", "edit-lname").val(lName));
    dialogBox.append($("<br>"));

    dialogBox.append($("<label>").text("Job Title:"));
    dialogBox.append($("<input>").attr("type", "text").attr("id", "edit-jobtitle").val(jobTitle));
    dialogBox.append($("<br>"));

    dialogBox.append($("<label>").text("Email:"));
    dialogBox.append($("<input>").attr("type", "text").attr("id", "edit-email").val(email));
    dialogBox.append($("<br>"));

    dialogBox.append($("<label>").text("Department Name:"));
    dialogBox.append($("<input>").attr("type", "text").attr("id", "edit-deptname").val(deptName));
    dialogBox.append($("<br>"));

    dialogBox.append($("<label>").text("Location Name:"));
    dialogBox.append($("<input>").attr("type", "text").attr("id", "edit-locname").val(locName));
    dialogBox.append($("<br>"));


    // open the dialog box
    dialogBox.dialog("open");

});

//Insert Personal
let insetPersoennl = () => {
    let insetPersoennl = document.querySelector('#insertPersonnel');
    let cancelPersonnelInsert = document.querySelector('#cancelPersonnelInsert');

    let personnelModal = document.querySelector('#personnelCreate');

    $(insetPersoennl).click(function () {
        console.log('person button clicked')
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

    // let editPersonnel = document.querySelector('.edit-personel');

    // $('.edit-personel').click(function () {
    //     // console.log('edit button clicked');
    //     $('#personnelEdit').show();
    // });


}

//Delete Pernonnel



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