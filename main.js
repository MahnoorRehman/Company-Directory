// jQuery Exact Match

$.expr[':'].textEquals = function(a, i, m) {
    return $(a).text().match("^" + m[3] + "$");
};

// jQuery Ignore

$.fn.ignore = function(sel){
    return this.clone().find(sel||">*").remove().end();
};


// Load Tables

$(window).on('load', function () {

    $('#loader').delay(500).fadeOut('slow', function () {
		$(this).remove();
	});

    if (!sessionStorage.getItem('lastTab')) {
        $('[data-bs-target="#nav-personnel"]').addClass('active');
        $('#nav-personnel').addClass('active');
    };
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        sessionStorage.setItem('lastTab', $(this).attr('data-bs-target'));
    });
    let lastTab = sessionStorage.getItem('lastTab');
    $(lastTab).addClass('active')
    if (lastTab) {
        $('[data-bs-target="' + lastTab + '"]').addClass('active');
    };

    populateTable('getAll', 'tablePers');
    populateTable('getAllDepartments', 'tableDept');
    populateTable('getAllLocations', 'tableLoc');
});


// Populate Main Tables

function populateTable(tableTab, tableBuild) {

    let table = $(`#${tableBuild}`)
    table.removeClass().addClass(`table ${tableTab}`).empty();

    $.ajax({
        url: `libs/php/${tableTab}.php`,
        type: 'POST',
        datatype: 'json',
        success: function(result) {

            function editClassId(icon) {
                if (tableBuild == "tablePers") {
                    return icon + ` persEdit" id="persEdit${result.data[j].id}`;
                } else if (tableBuild == "tableDept") {
                    return icon + ` deptEdit" id="deptEdit${result.data[j].id}`;
                } else return icon + ` locEdit" id="locEdit${result.data[j].id}`;
            };

            function delClassId(icon) {
                if (tableBuild == "tablePers") {
                    return icon + ` persDel" id="persDel${result.data[j].id}`;
                } else if (tableBuild == "tableDept") {
                    return icon + ` deptDel" id="deptDel${result.data[j].id}`;
                } else return icon + ` locDel" id="locDel${result.data[j].id}`;
            };

            // Table Head

            let data = Object.keys(result.data[0]);
            table.append('<thead class="sticky-top">' + '<tr>');
            for (let key of data) {
                if (key === 'id') {
                    continue;
                } else if (key === 'Full Name' || (tableBuild === 'tableDept' && key === 'Department') || (tableBuild === 'tableLoc' && key === 'Location')) {
                    $(`#${tableBuild} tr`).append('<th>' + key + '<span class="sorter"> <i class="fas fa-sort-up"></i></span>');
                } else {
                    $(`#${tableBuild} tr`).append('<th>' + key + '<span class="sorter"> <i class="fas fa-sort"></i></span>');
                };
            }; 
            $(`#${tableBuild} tr`).append('<th class="updateCol" style="text-align:center;">' + 'Edit').append('<th class="deleteCol" style="text-align:center">' + 'Delete');

            // Table Body

            j = 0;
            table.append(`<tbody id="${tableBuild}accordion">`);
            $.each(result.data, function (i,value) {
                let tableRow = '<tr>';
                let tableRowHidden = '<tr><td colspan="7" class="hiddenRow">';
                $.each(value, function (k,val) {
                    if (k==='id') {
                        return;
                    } else {
                        if (k === 'Full Name' || (tableBuild === 'tableDept' && k === 'Department') || (tableBuild === 'tableLoc' && k === 'Location')) {
                            tableRow += `<td data-bs-toggle="collapse" href=".${tableBuild}expand${j}" class="clickable"><span class='dropdown'><i class="fas fa-chevron-down"></i>&nbsp;&nbsp;</span><div style='display:inline'>${val}</div></td>`;
                            tableRowHidden += `<div class="${tableBuild}expand${j} collapse hide">${val.slice(0,-2)}<span class=dropSort></span></div>`;    
                            sorter1 = sorter2 = '';
                            sorter1 += val;
                            sorter2 += val.slice(0,-2);                    
                        } else {
                            tableRow += `<td data-bs-toggle="collapse" href=".${tableBuild}expand${j}" class="clickable"><span class='dropdown'><i class="fas fa-chevron-down"></i>&nbsp;&nbsp;</span><div style='display:inline'>${val+'<span class="hide">'+sorter1+'</span>'}</div></td>`;
                            tableRowHidden += `<div class="${tableBuild}expand${j} collapse" data-bs-parent="#${tableBuild}accordion">${val+'<span class="hide">'+sorter2+'</span><span class=dropSort></span>'}</div>`;
                        }
                    };
                });
                tableRow += `<td style="text-align:center"><i class="${editClassId('fas fa-edit')}">` + '</i></td>';
                tableRow += `<td style="text-align:center"><span><i class="${delClassId('fas fa-trash')}">` + '</i></span></td>';
                tableRow += "</tr>";
                $(table).append(tableRow).append(tableRowHidden);
                j++;
            });
        },
    });
};


// Click Dropdown Timer

$(document).on('click', 'tbody tr td', function() {
    let unclick = $(this);
    unclick.addClass('unclickable');
    setTimeout(function() { 
        unclick.removeClass('unclickable');
    }, 500);
});


// Enable Table Sort

$(document).on('click', 'th', function() {

    $(this).hasClass('switch') ? $(this).removeClass('switch') : $(this).addClass('switch');
    $(this).hasClass('switch') ? $('.dropSort').html("aa") : $('.dropSort').html("zz");

    let table = $(this).parents('table').eq(0);
    $(table).find('.sorter').html('&nbsp;<i class="fas fa-sort"></i>');
    $(this).children().html('&nbsp;<i class="fas fa-sort-up"></i>'); 

    let rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc;
    
    if (this.asc) {
        $(table).find('.sorter').html('&nbsp;<i class="fas fa-sort"></i>');
        $(this).children().html('&nbsp;<i class="fas fa-sort-down"></i>');
        rows = rows.reverse();
    };
    for (let i = 0; i < rows.length; i++) {
        table.append(rows[i]);
    };
});
function comparer(index) {
    return function(a, b) {
        let valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
    };
};
function getCellValue(row, index) {
    return $(row).find('div').eq(index).text();
};


// Enable Table Search

function search(searchBar, table) {
    $(`${searchBar}`).on("keyup", function() {
        let value = $(this).val().toLowerCase();
            $(`${table} tbody tr`).filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value)>-1)
        });
    });
};


// Back to Top

$('.table-responsive').on('scroll', function() {
    if ($('#nav-personnel .table-responsive').scrollTop() > 40) {
        $('.top-pers').css({"opacity": "1", 'transition-duration':'.5s', 'pointer-events': 'auto'});
    } else {
        $('.top-pers').css({"opacity": "0", 'transition-duration':'.5s', 'pointer-events': 'none'});
    }
    if ($('#nav-departments .table-responsive').scrollTop() > 40) {
        $('.top-dep').css({"opacity": "1", 'transition-duration':'.5s', 'pointer-events': 'auto'});
    } else {
        $('.top-dep').css({"opacity": "0", 'transition-duration':'.5s', 'pointer-events': 'none'});
    }
    if ($('#nav-locations .table-responsive').scrollTop() > 40) {
        $('.top-loc').css({"opacity": "1", 'transition-duration':'.5s', 'pointer-events': 'auto'});
    } else {
        $('.top-loc').css({"opacity": "0", 'transition-duration':'.5s', 'pointer-events': 'none'});
    }
});
$('.fa-arrow-circle-up').on('click', function() {
    $('.table-responsive').scrollTop(0);
});


// Format Inputs

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' ');
};



//------------------ PERSONNEL ------------------//

function departmentsList(dep) {
    $('.departmentSel').empty();
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        datatype: 'json',
        success: function(result) {

            $('.departmentSel').append('<option value="" selected="true" disabled>Choose a Department</option>');

            for (let i = 0; i < result.data.length; i++) {
                $('.departmentSel').append($('<option>', {
                    value: result.data[i].id,
                    text: result.data[i].Department
                }));
            };
            $(".departmentSel option:textEquals("+dep+")").attr('selected', 'selected');
        },
    });
};

// Search Pesonnel

search('#persSearch', '#tablePers');

// Insert Personnel

$('#insertPersonnel').on('click', function() {

    departmentsList();
    $('#personnelCreate').modal('show');

    $("#personCheck").click(function() {
        $("#confirmPersCreate").attr("disabled", !this.checked);
    });

    $("#persCreate").unbind().submit(function() {
        $.ajax({
            url: 'libs/php/insertPersonnel.php',
            type: 'POST',
            datatype: 'json',
            data: {
                firstName: titleCase($('#firstNameCreate').val()),
                lastName: titleCase($('#lastNameCreate').val()),
                jobTitle: titleCase($('#jobTitleCreate').val()),
                email: $('#emailCreate').val(),
                department: $('#departmentSelInsert').val(),
            },
        });
    });
});

$("#personnelCreate").on('hide.bs.modal', function() {
    $('#firstNameCreate, #lastNameCreate, #jobTitleCreate, #emailCreate').val('');
    $('#personCheck').prop('checked', false);
    $('#confirmPersCreate').prop('disabled', true);
});


// Update Personnel

$(document).on('click', '.persEdit', function() {

    let id = $(this).attr("id").slice(8);
    let setDept = $(this).parent().prev().prev().find('div').ignore('span').text();
    departmentsList(setDept);

    let fullName = $(this).parent().prev().prev().prev().prev().prev().find('div').ignore('span').text().split(" ");
    $('#firstName').val(fullName[0]);
    $('#lastName').val(fullName[1]);
    $('#jobTitle').val($(this).parent().prev().prev().prev().prev().find('div').ignore('span').text());
    $('#email').val($(this).parent().prev().prev().prev().find('div').ignore('span').text());
    $('.persName').html($(this).parent().prev().prev().prev().prev().prev().html());

    $('#personnelEdit').modal('show');

    $("#personUpd").click(function() {
        $("#confirmPersEdit").attr("disabled", !this.checked);
    });

    $("#persUpdate").unbind().submit(function() {
        $.ajax({
            url: 'libs/php/updatePersonnel.php',
            type: 'POST',
            datatype: 'json',
            data: {
                id: id,
                firstName: titleCase($('#firstName').val()),
                lastName: titleCase($('#lastName').val()),
                jobTitle: titleCase($('#jobTitle').val()),
                email: $('#email').val(),
                department: $('#departmentSelEdit').val(),
            },
        });
    }); 
});
$("#personnelEdit").on('hide.bs.modal', function() {
    $('#personUpd').prop('checked', false);
    $('#confirmPersEdit').prop('disabled', true);
});


// Delete Personnel

$(document).on('click', '.persDel', function() {

    let id = $(this).attr("id").slice(7);    
    $('.persName').html($(this).parent().parent().prev().prev().prev().prev().prev().prev().html());
    $('#personnelDel').modal('show');

    $("#persDelete").unbind().submit(function() {
        $.ajax({
            url: 'libs/php/deletePersonnelByID.php',
            type: 'POST',
            datatype: 'json',
            data: {
                id: id
            },
        });
    });
});



//------------------ DEPARTMENTS ------------------//

function locationList(loc) {
    $('.locationSel').empty();
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'POST',
        datatype: 'json',
        success: function(result) {

            $('.locationSel').append('<option value="" selected="true" disabled>Choose a Location</option>');

            for (let i = 0; i < result.data.length; i++) {
                $('.locationSel').append($('<option>', {
                    value: result.data[i].id,
                    text: result.data[i].Location
                }));
            };
            $(".locationSel option:textEquals("+loc+")").attr('selected', 'selected');
        },
    });
};

// Search Departments

search('#deptSearch', '#tableDept');

// Insert Department

$('#insertDepartment').on('click', function() {
    
    locationList();
    $('#departmentCreate').modal('show');
  
    $("#deptCheck").click(function() {
        $("#confirmDepCreate").attr("disabled", !this.checked);
    });

    $("#deptCreate").unbind().submit(function() {
        $.ajax({
            url: 'libs/php/insertDepartment.php',
            type: 'POST',
            datatype: 'json',
            data: {
                name: titleCase($('#departmentCreateName').val()),
                location: $('#locationSelInsert').val(),
            },
        });
    });
});
$("#departmentCreate").on('hide.bs.modal', function() {
    $('#departmentCreateName').val('');
    $('#deptCheck').prop('checked', false);
    $('#confirmDepCreate').prop('disabled', true);
});


// Update Department

$(document).on('click', '.deptEdit', function() {

    let id = $(this).attr("id").slice(8);
    let setLoc = $(this).parent().prev().find('div').ignore('span').text();
    locationList(setLoc);

    $('.depName').html($(this).parent().prev().prev().html());
    $('#department').val($(this).parent().prev().prev().find('div').ignore('span').text());
    
    $('#departmentEdit').modal('show');

    $("#depUpd").click(function() {
        $("#confirmDepEdit").attr("disabled", !this.checked);
    });

    $("#depUpdate").unbind().submit(function() {
        $.ajax({
            url: 'libs/php/updateDepartment.php',
            type: 'POST',
            datatype: 'json',
            data: {
                id: id,
                department: titleCase($('#department').val()),
                location: $('#locationSelEdit').val()
            },
        });
    });
});
$("#departmentEdit").on('hide.bs.modal', function() {
    $('#depUpd').prop('checked', false);
    $('#confirmDepEdit').prop('disabled', true);
});


// Delete Department

$(document).on('click', '.deptDel', function() {

    let depID = $(this).attr("id").slice(7);
    let depName = $(this).parent().parent().prev().prev().prev().find('div').text();
    $('.depName').html(depName);

    $.ajax({
        url: 'libs/php/getPersonnelByID.php',
        type: 'POST',
        datatype: 'json',
        data: {
            departmentID: depID
        },
        success: function(result) {

            if ( result.perscount > 0 ) {
                alert(`This department (${depName}) has dependencies! \nPlease refer to the Personnel table.`);
            } else {
                $('#departmentDel').modal('show');
                $("#depDelete").unbind().submit(function() {
                    $.ajax({
                        url: 'libs/php/deleteDepartmentByID.php',
                        type: 'POST',
                        datatype: 'json',
                        data: {
                            id: depID
                        },
                    });
                });
            };
        },
    });
});



//------------------ LOCATIONS ------------------//

// Search Locations

search('#locSearch', '#tableLoc');

// Insert Location

$('#insertLocation').on('click', function() {

    $('#locationCreate').modal('show');

    $("#locCheck").click(function() {
        $("#confirmLocCreate").attr("disabled", !this.checked);
    });

    $("#locCreate").unbind().submit(function() {
        $.ajax({
            url: 'libs/php/insertLocation.php',
            type: 'POST',
            datatype: 'json',
            data: {
                name: titleCase($('#locationCreateName').val()),
            },
        });
    });
});
$("#locationCreate").on('hide.bs.modal', function() {
    $('#locationCreateName').val('');
    $('#locCheck').prop('checked', false);
    $('#confirmLocCreate').prop('disabled', true);
});


// Update Location

$(document).on('click', '.locEdit', function() {

    let id = $(this).attr("id").slice(7);

    $('.locName').html($(this).parent().prev().html());
    $('#location').val($(this).parent().prev().find('div').ignore('span').text());

    $('#locationEdit').modal('show');

    $("#locUpd").click(function() {
        $("#confirmLocEdit").attr("disabled", !this.checked);
    });

    $("#locUpdate").unbind().submit(function() {
        $.ajax({
            url: 'libs/php/updateLocation.php',
            type: 'POST',
            datatype: 'json',
            data: {
                id: id,
                location: titleCase($('#location').val()),
            },
        });
    });
});
$("#locationEdit").on('hide.bs.modal', function() {
    $('#locUpd').prop('checked', false);
    $('#confirmLocEdit').prop('disabled', true);
});


// Delete Location

$(document).on('click', '.locDel', function() {

    let locID = $(this).attr("id").slice(6);
    let locName = $(this).parent().parent().prev().prev().find('div').text();
    $('.locName').html(locName);

    $.ajax({
        url: 'libs/php/getDepartmentByID.php',
        type: 'POST',
        datatype: 'json',
        data: {
            locationID: locID
        },
        success: function(result) {

            if ( result.depcount > 0 ) {
                alert(`This location (${locName}) has dependencies! \nPlease refer to the Departments table.`);
            } else {
                $('#locationDel').modal('show');
                $("#locDelete").unbind().submit(function() {
                    $.ajax({
                        url: 'libs/php/deleteLocationByID.php',
                        type: 'POST',
                        datatype: 'json',
                        data: {
                            id: locID
                        },
                    });
                });
            };
        },
    });
});