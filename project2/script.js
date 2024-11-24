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
    if ($("#addPersonnelBtn").hasClass("active")) {
      addPersonnel()
      $("#addPersonnelFirstName").val('')
      $("#addPersonnelLastName").val('')
      $("#addPersonnelJobTitle").val('')
      $("#addPersonnelEmailAddress").val('')
      $("#addPersonnelDepartment").val('')
    } else if ($("#addDepartmentsBtn").hasClass("active")) {
      addDepartment()
      $("#addDepartmentName").val('');
      $("#addPersonnelBtn").trigger('click');
    } else {
      addLocation();
      $("#addLocationName").val('');
      $("#addPersonnelBtn").trigger('click');
    }
    $("#refreshBtn").trigger('click')
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

  $("#editPersonnelBtn").on("click", function(e) {})

  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
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

  $("#editDepartmentBtn").on("click", function(e) {})

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

  $("#editLocationBtn").on("click", function(e) {
    const name = $("#editLocationName").val();
    const id = $("#editLocationID").val();
    $.ajax({
      url: "./libs/php/editLocationByID.php",
      type: 'POST',
      data: {
        name,
        id
      },
      success: function(result) {
        alert(`${name} has been updated`)
        $("#refreshBtn").trigger('click')
      }
    })
  })

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
          $("#deletePersonnelID").val($(e.relatedTarget).attr("data-id"))
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

  $("#deletePersonnelBtn").on("click", function(e) {
    const name = $("#deletePersonnelName").html();
    const id = $("#deletePersonnelID").val()
    $.ajax({
      url: "./libs/php/deletePersonnelByID.php",
      type: "POST",
      data: {
        id,
        name
      },
      success: function(result) {
        alert(`${name} has been removed from Personnel`)
        $("#refreshBtn").trigger('click')
      }
    })
  })

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
          $("#deleteDepartmentID").val($(e.relatedTarget).attr("data-id"))
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

  $("#deleteDepartmentBtn").on("click", function(e) {
    const name = $("#deleteDepartmentName").html();
    const id = $("#deleteDepartmentID").val()
    $.ajax({
      url: "./libs/php/deleteDepartmentByID.php",
      type: "POST",
      data: {
        id,
        name
      },
      success: function(result) {
        alert(`${name} has been removed from Departments`)
        $("#refreshBtn").trigger('click')
      }
    })
    
  })

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
          $("#deleteLocationID").val($(e.relatedTarget).attr("data-id"))
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

  $("#deleteLocationBtn").on("click", function(e) {
    const name = $("#deleteLocationName").html();
    const id = $("#deleteLocationID").val()
    $.ajax({
      url: "./libs/php/deleteLocationByID.php",
      type: "POST",
      data: {
        id,
        name
      },
      success: function(result) {
        alert(`${name} has been removed from Locations`)
        $("#refreshBtn").trigger('click')
      }
    })
  })

  
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

function addPersonnel() {
  const firstName = $("#addPersonnelFirstName").val()
  const lastName = $("#addPersonnelLastName").val()
  const jobTitle = $("#addPersonnelJobTitle").val()
  const email = $("#addPersonnelEmailAddress").val()
  const departmentID = $("#addPersonnelDepartment").val()
  $.ajax({
    url: "./libs/php/insertPersonnel.php",
    type: "POST",
    data: {
      firstName,
      lastName,
      jobTitle,
      email,
      departmentID
    },
    success: function(result) {
      alert(`${result.data.name} has been added to Personnel`)
    }
  }) 
}

function addDepartment() {
  const name = $("#addDepartmentName").val()
  const locationID = $("#addDepartmentLocation").val()
  $.ajax({
    url: "./libs/php/insertDepartment.php",
    type: "POST",
    data: {
      name,
      locationID
    },
    success: function(result) {
      alert(`${result.data.name} has been added to Departments`)
    }
  })  
}

function addLocation() {
  const name = $("#addLocationName").val()
  $.ajax({
    url: "./libs/php/insertLocation.php",
    type: "POST",
    data: {
      name
    },
    success: function(result) {
      alert(`${result.data.name} has been added to Locations`)
    }
  })  
}

