$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(2000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

$("document").ready(function () {
  fillPersonnelList(getArrayOfAllPersonnel());
  fillDropdowns()

  $("#searchInp").on("keyup", function () {
    // your code
    if ($("#personnelBtn").hasClass("active")) {
      $.ajax({
        url: "./libs/php/SearchAll.php",
        type: "POST",
        dataType: "json",
        data: {
          txt: $("#searchInp").val(),
        },
        success: function (result) {
          fillPersonnelList(result.data.found);
        },
      });
    } else {
      if ($("#departmentsBtn").hasClass("active")) {
        $.ajax({
          url: "./libs/php/SearchAllDepartments.php",
          type: "POST",
          dataType: "json",
          data: {
            txt: $("#searchInp").val(),
          },
          success: function (result) {
            fillDepartmentsList(result.data.found);
          },
        });
      } else {
        $.ajax({
          url: "./libs/php/SearchAllLocations.php",
          type: "POST",
          dataType: "json",
          data: {
            txt: $("#searchInp").val(),
          },
          success: function (result) {
            fillLocationsList(result.data.found);
          },
        });
      }
    }
  });

  $("#refreshBtn").on("click", function () {
    $("#filterDepartment").val("No Filter");
    $("#filterLocation").val("No Filter");
    if ($("#personnelBtn").hasClass("active")) {
      // Refresh personnel table
      $("#searchInp").val('');
      fillPersonnelList(getArrayOfAllPersonnel());
    } else {
      if ($("#departmentsBtn").hasClass("active")) {
        // Refresh department table
        $("#searchInp").val('');
        fillDepartmentsList(getArrayOfAllDepartments());
      } else {
        // Refresh location table
        $("#searchInp").val('');
        fillLocationsList(getArrayOfAllLocations());
      }
    }
  });

  $("#filterBtn").on("click", function () {
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    if($("#filterDepartment").val() == "No Filter" && $("#filterLocation").val() == "No Filter") {
      $("#personnelBtn").trigger('click');
      fillPersonnelList(getArrayOfAllPersonnel());      
    } else {
      $("#personnelBtn").trigger('click');
      fillPersonnelList(getFilteredArrayOfPersonnel());
    }
  });

  $("#addBtn").on("click", function () {
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  });

  $("#personnelBtn").on("click", function () {
    // Call function to refresh personnel table
    $("#searchInp").val('');
    fillPersonnelList(getArrayOfAllPersonnel());
  });

  $("#departmentsBtn").on("click", function () {
    // Call function to refresh department table
    $("#searchInp").val('');
    fillDepartmentsList(getArrayOfAllDepartments());
  });

  $("#locationsBtn").on("click", function () {
    // Call function to refresh location table
    $("#searchInp").val('');
    fillLocationsList(getArrayOfAllLocations());
  });

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

          $("#editPersonnelDepartment").html("");

          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name,
              })
            );
          });

          $("#editPersonnelDepartment").val(
            result.data.personnel[0].departmentID
          );
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  });

  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        console.log(result);
        if (result.status.code == 200) {
          $("#editDepartmentID").val(result.data.department[0].id);

          $("#editDepartmentName").val(result.data.department[0].name);

          $("#editDepartmentLocation").html("");

          $.each(result.data.location, function () {
            $("#editDepartmentLocation").append(
              $("<option>", {
                value: this.id,
                text: this.name,
              })
            );
          });

          $("#editDepartmentLocation").val(
            result.data.department[0].locationID
          );
        } else {
          $("#editDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  });

  $("#editLocationModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#editLocationID").val(result.data[0].id);
          $("#editLocationName").val(result.data[0].name);
        } else {
          $("#editLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  });

  $("#deletePersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#deletePersonnelName").html(
            `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`
          );
        } else {
          $("#deletePersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deletePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  });

  $("#deleteDepartmentModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#deleteDepartmentName").html(`${result.data.department[0].name}`);
        } else {
          $("#deleteDepartmentModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deleteDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  });

  $("#deleteLocationModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#deleteLocationName").html(`${result.data[0].name}`);
        } else {
          $("#deleteLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deletePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  });

  $("#editPersonnelForm").on("submit", function (e) {
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour

    e.preventDefault();

    // AJAX call to save form data
  });
});

function getArrayOfAllPersonnel() {
  let personnelList;
  $.ajax({
    url: "./libs/php/getAll.php",
    type: "GET",
    async: false,
    success: function (result) {
      if (result.status.code == "200") {
        personnelList = result.data;
      }
    },
  });
  return personnelList;
}

function getFilteredArrayOfPersonnel() {
  let personnelList;
  const filterDepartment = $("#filterDepartment").val()
  const filterLocation = $("#filterLocation").val()
  $.ajax({
    url: "./libs/php/getFilteredPersonnel.php",
    type: "GET",
    async: false,
    data: {
      filterDepartment,
      filterLocation     
    },
    success: function (result) {
      if (result.status.code == "200") {
        personnelList = result.data;
      }
    },
  });
  return personnelList;
}


function getArrayOfAllDepartments() {
  let departmentsList;
  $.ajax({
    url: "./libs/php/getAllDepartments.php",
    type: "GET",
    async: false,
    success: function (result) {
      if (result.status.code == "200") {
        departmentsList = result.data;
      }
    },
  });
  return departmentsList;
}

function getArrayOfAllLocations() {
  let locationsList;
  $.ajax({
    url: "./libs/php/getAllLocations.php",
    type: "GET",
    async: false,
    success: function (result) {
      if (result.status.code == "200") {
        locationsList = result.data;
      }
    },
  });
  return locationsList;
}

function fillPersonnelList(personnelList) {
  $("#personnelTableBody").empty();
  $("#departmentTableBody").empty();
  $("#locationTableBody").empty();
  for (let i = 0; i < personnelList.length; i++) {
    $("#personnelTableBody").append(`
      <tr>
        <td class="align-middle text-nowrap">
          ${personnelList[i].lastName}, ${personnelList[i].firstName}
          </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${personnelList[i].department}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${personnelList[i].location}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${personnelList[i].email}
        </td>
        <td class="text-end text-nowrap">
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnelList[i].id}">
            <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnelList[i].id}">
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        </td>
      </tr>
        `);
  }
}

function fillDepartmentsList(departmentsList) {
  $("#personnelTableBody").empty();
  $("#departmentTableBody").empty();
  $("#locationTableBody").empty();
  for (let i = 0; i < departmentsList.length; i++) {
    $("#departmentTableBody").append(`
      <tr>
        <td class="align-middle text-nowrap">
          ${departmentsList[i].name}
        </td>
        <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${departmentsList[i].location}
        </td>
        <td class="align-middle text-end text-nowrap">
          <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${departmentsList[i].id}">
          <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${departmentsList[i].id}">
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        </td>
      </tr>    
        `);
  }
}

function fillLocationsList(locationsList) {
  $("#personnelTableBody").empty();
  $("#departmentTableBody").empty();
  $("#locationTableBody").empty();
  for (let i = 0; i < locationsList.length; i++) {
    $("#locationTableBody").append(`
      <tr>
        <td class="align-middle text-nowrap">
        ${locationsList[i].name}
        </td>
        <td class="align-middle text-end text-nowrap">
          <button type="button" class="btn btn-primary btn-sm"data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${locationsList[i].id}">
            <i class="fa-solid fa-pencil fa-fw"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm"data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${locationsList[i].id}">
            <i class="fa-solid fa-trash fa-fw"></i>
          </button>
        </td>
      </tr>
        `);
  }
}

function fillDropdowns() {
  const departments = getArrayOfAllDepartments()
  const locations = getArrayOfAllLocations()
  for(let i=0; i<departments.length;i++) {
    $("#filterDepartment").append(
      `<option value=${departments[i].id}>${departments[i].name}</option>
      `)
  }

  for(let i=0; i<locations.length;i++) {
    $("#filterLocation").append(
      `<option value=${locations[i].id}>${locations[i].name}</option>
      `)
  }

  for(let i=0; i<departments.length;i++) {
    $("#addPersonnelDepartment").append(
      `<option value=${departments[i].id}>${departments[i].name}</option>
      `)
  }

  for(let i=0; i<locations.length;i++) {
    $("#addDepartmentLocation").append(
      `<option value=${locations[i].id}>${locations[i].name}</option>
      `)
  }
  
}