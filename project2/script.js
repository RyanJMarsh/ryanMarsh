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
  fillDropdowns();

  $("#searchInp").on("keyup", function () {
    if ($("#personnelBtn").hasClass("active")) {
      $.ajax({
        url: "./libs/php/SearchAll.php",
        type: "GET",
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
          type: "GET",
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
          type: "GET",
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
      $("#searchInp").val("");
      fillPersonnelList(getArrayOfAllPersonnel());
    } else {
      if ($("#departmentsBtn").hasClass("active")) {
        $("#searchInp").val("");
        fillDepartmentsList(getArrayOfAllDepartments());
      } else {
        $("#searchInp").val("");
        fillLocationsList(getArrayOfAllLocations());
      }
    }
  });

  $("#filterDepartment").on("change", function () {
    if (this.value !== "No Filter") {
      $("#filterLocation").val("No Filter");
    }
    fillPersonnelList(getFilteredArrayOfPersonnel());
  });

  $("#filterLocation").on("change", function () {
    if (this.value !== "No Filter") {
      $("#filterDepartment").val("No Filter");
    }
    fillPersonnelList(getFilteredArrayOfPersonnel());
  });

  $("#addModalBtn").on("click", function () {
    if ($("#personnelBtn").hasClass("active")) {
      $("#addPersonnelModal").modal("show");
    } else if ($("#departmentsBtn").hasClass("active")) {
      $("#addDepartmentModal").modal("show");
    } else {
      $("#addLocationModal").modal("show");
    }
  });

  $("#addPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    const firstName = $("#addPersonnelFirstName").val();
    const lastName = $("#addPersonnelLastName").val();
    const jobTitle = $("#addPersonnelJobTitle").val();
    const email = $("#addPersonnelEmailAddress").val();
    const departmentID = $("#addPersonnelDepartment").val();
    $.ajax({
      url: "./libs/php/insertPersonnel.php",
      type: "POST",
      data: {
        firstName,
        lastName,
        jobTitle,
        email,
        departmentID,
      },
      success: function (result) {
        $("#addPersonnelModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });

  $("#addPersonnelModal").on("hidden.bs.modal", function (e) {
    $("#addPersonnelFirstName").val("");
    $("#addPersonnelLastName").val("");
    $("#addPersonnelJobTitle").val("");
    $("#addPersonnelEmailAddress").val("");
  });

  $("#addDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#addDepartmentName").val();
    const locationID = $("#addDepartmentLocation").val();
    $.ajax({
      url: "./libs/php/insertDepartment.php",
      type: "POST",
      data: {
        name,
        locationID,
      },
      success: function (result) {
        $("#addDepartmentModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });

  $("#addDepartmentModal").on("hidden.bs.modal", function (e) {
    $("#addDepartmentName").val("");
  });

  $("#addLocationForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#addLocationName").val();
    $.ajax({
      url: "./libs/php/insertLocation.php",
      type: "POST",
      data: {
        name,
      },
      success: function (result) {
        $("#addLocationModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });

  $("#addLocationModal").on("hidden.bs.modal", function (e) {
    $("#addLocationName").val("");
  });

  $("#personnelBtn").on("click", function () {
    $("#searchInp").val("");
    $("#filterModalBtn").attr("disabled", false);
    fillPersonnelList(getArrayOfAllPersonnel());
  });

  $("#departmentsBtn").on("click", function () {
    $("#searchInp").val("");
    $("#filterModalBtn").attr("disabled", true);
    fillDepartmentsList(getArrayOfAllDepartments());
  });

  $("#locationsBtn").on("click", function () {
    $("#searchInp").val("");
    $("#filterModalBtn").attr("disabled", true);
    fillLocationsList(getArrayOfAllLocations());
  });

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getPersonnelByID.php",
      type: "GET",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          $("#editPersonnelID").val(result.data.personnel[0].id);

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

  $("#editPersonnelForm").on("submit", function (e) {
    e.preventDefault();
    const id = $("#editPersonnelID").val();
    const firstName = $("#editPersonnelFirstName").val();
    const lastName = $("#editPersonnelLastName").val();
    const jobTitle = $("#editPersonnelJobTitle").val();
    const email = $("#editPersonnelEmailAddress").val();
    const departmentID = $("#editPersonnelDepartment").val();
    $.ajax({
      url: "./libs/php/editPersonnelByID.php",
      type: "POST",
      data: {
        firstName,
        lastName,
        jobTitle,
        email,
        departmentID,
        id,
      },
      success: function (result) {
        $("#editPersonnelModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });

  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getDepartmentByID.php",
      type: "GET",
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

  $("#editDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#editDepartmentName").val();
    const id = $("#editDepartmentID").val();
    const locationID = $("#editDepartmentLocation").val();
    $.ajax({
      url: "./libs/php/editDepartmentByID.php",
      type: "POST",
      data: {
        name,
        locationID,
        id,
      },
      success: function (result) {
        $("#editDepartmentModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });

  $("#editLocationModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getLocationByID.php",
      type: "GET",
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

  $("#editLocationForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#editLocationName").val();
    const id = $("#editLocationID").val();
    $.ajax({
      url: "./libs/php/editLocationByID.php",
      type: "POST",
      data: {
        name,
        id,
      },
      success: function (result) {
        $("#editLocationModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });

  $("#deletePersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getPersonnelByID.php",
      type: "GET",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        if (result.status.code == 200) {
          $("#deletePersonnelID").val($(e.relatedTarget).attr("data-id"));
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

  $("#deletePersonnelForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#deletePersonnelName").html();
    const id = $("#deletePersonnelID").val();
    $.ajax({
      url: "./libs/php/deletePersonnelByID.php",
      type: "POST",
      data: {
        id,
        name,
      },
      success: function (result) {
        $("#deletePersonnelModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });  

  $("#confirmDeleteDepartmentForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#deleteDepartmentName").text();
    const id = $("#deleteDepartmentID").val();
    $.ajax({
      url: "./libs/php/deleteDepartmentByID.php",
      type: "POST",
      data: {
        id,
        name,
      },
      success: function (result) {
        $("#deleteDepartmentModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
  });

  $("#confirmDeleteLocationForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#deleteLocationName").html();
    const id = $("#deleteLocationID").val();
    $.ajax({
      url: "./libs/php/deleteLocationByID.php",
      type: "POST",
      data: {
        id,
        name,
      },
      success: function (result) {
        $("#deleteLocationModal").modal("hide");
        $("#refreshBtn").trigger("click");
      },
    });
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
  const filterDepartment = $("#filterDepartment").val();
  const filterLocation = $("#filterLocation").val();
  $.ajax({
    url: "./libs/php/getFilteredPersonnel.php",
    type: "GET",
    async: false,
    data: {
      filterDepartment,
      filterLocation,
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

  const frag = document.createDocumentFragment();

  personnelList.forEach(function (item, index) {
    const row = document.createElement("tr");

    const name = document.createElement("td");
    name.classList = "align-middle text-nowrap";

    const nameText = document.createTextNode(
      item.lastName + ", " + item.firstName
    );
    name.append(nameText);

    row.append(name);

    const department = document.createElement("td");
    department.classList = "align-middle text-nowrap d-none d-md-table-cell";

    const departmentText = document.createTextNode(item.department);
    department.append(departmentText);

    row.append(department);

    const location = document.createElement("td");
    location.classList = "align-middle text-nowrap d-none d-md-table-cell";

    const locationText = document.createTextNode(item.location);
    location.append(locationText);

    row.append(location);

    const email = document.createElement("td");
    email.classList = "align-middle text-nowrap d-none d-md-table-cell";

    const emailText = document.createTextNode(item.email);
    email.append(emailText);

    row.append(email);

    const buttons = document.createElement("td");
    buttons.classList = "text-end text-nowrap";

    const editButton = document.createElement("button");
    editButton.classList = "btn btn-primary btn-sm mx-1";
    editButton.type = "button";
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#editPersonnelModal");
    editButton.setAttribute("data-id", item.id);

    const editImg = document.createElement("i");
    editImg.classList = "fa-solid fa-pencil fa-fw";

    editButton.append(editImg);
    buttons.append(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList = "btn btn-primary btn-sm";
    deleteButton.type = "button";
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal");
    deleteButton.setAttribute("data-id", item.id);

    const deleteImg = document.createElement("i");
    deleteImg.classList = "fa-solid fa-trash fa-fw";

    deleteButton.append(deleteImg);
    buttons.append(deleteButton);

    row.append(buttons);

    frag.append(row);
  });

  $("#personnelTableBody").append(frag);
}

function fillDepartmentsList(departmentsList) {
  $("#personnelTableBody").empty();
  $("#departmentTableBody").empty();
  $("#locationTableBody").empty();

  const frag = document.createDocumentFragment();

  departmentsList.forEach(function (item, index) {
    const row = document.createElement("tr");

    const name = document.createElement("td");
    name.classList = "align-middle text-nowrap";

    const nameText = document.createTextNode(item.name);
    name.append(nameText);

    row.append(name);

    const location = document.createElement("td");
    location.classList = "align-middle text-nowrap d-none d-md-table-cell";

    const locationText = document.createTextNode(item.location);
    location.append(locationText);

    row.append(location);

    const buttons = document.createElement("td");
    buttons.classList = "text-end text-nowrap";

    const editButton = document.createElement("button");
    editButton.classList = "btn btn-primary btn-sm mx-1";
    editButton.type = "button";
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#editDepartmentModal");
    editButton.setAttribute("data-id", item.id);

    const editImg = document.createElement("i");
    editImg.classList = "fa-solid fa-pencil fa-fw";

    editButton.append(editImg);
    buttons.append(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList = "btn btn-primary btn-sm deleteDepartmentBtn";    
    deleteButton.setAttribute("data-id", item.id);

    const deleteImg = document.createElement("i");
    deleteImg.classList = "fa-solid fa-trash fa-fw";


    deleteButton.append(deleteImg);
    buttons.append(deleteButton);

    row.append(buttons);

    frag.append(row);
  });
  $("#departmentTableBody").append(frag);

  $(".deleteDepartmentBtn").on("click", function (e) {   
    const id =  $(this).attr("data-id")
    $.ajax({
      url: "./libs/php/checkDepartmentUse.php",
      type: "GET",
      dataType: "json",
      data: {
        id
      },
      success: function (result) {
        if (result.status.code == 200) {
          if (result.data[0].personnelCount == 0) {
            $("#deleteDepartmentID").val(id);
            $("#deleteDepartmentName").text(result.data[0].departmentName);
            $("#deleteDepartmentModal").modal("show")
          } else {
            $("#cannotDeleteDepartmentName").text(result.data[0].departmentName)
            $("#personnelCount").text(result.data[0].personnelCount)
            $("#cannotDeleteDepartmentModal").modal("show")
          }
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
}

function fillLocationsList(locationsList) {
  $("#personnelTableBody").empty();
  $("#departmentTableBody").empty();
  $("#locationTableBody").empty();

  const frag = document.createDocumentFragment();

  locationsList.forEach(function (item, index) {
    const row = document.createElement("tr");

    const name = document.createElement("td");
    name.classList = "align-middle text-nowrap";

    const nameText = document.createTextNode(item.name);
    name.append(nameText);

    row.append(name);

    const buttons = document.createElement("td");
    buttons.classList = "text-end text-nowrap";

    const editButton = document.createElement("button");
    editButton.classList = "btn btn-primary btn-sm mx-1";
    editButton.type = "button";
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#editLocationModal");
    editButton.setAttribute("data-id", item.id);

    const editImg = document.createElement("i");
    editImg.classList = "fa-solid fa-pencil fa-fw";

    editButton.append(editImg);
    buttons.append(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList = "btn btn-primary btn-sm deleteLocationBtn";
    deleteButton.type = "button";
    deleteButton.setAttribute("data-id", item.id);

    const deleteImg = document.createElement("i");
    deleteImg.classList = "fa-solid fa-trash fa-fw";

    deleteButton.append(deleteImg);
    buttons.append(deleteButton);

    row.append(buttons);

    frag.append(row);
  });
  $("#locationTableBody").append(frag);

  $(".deleteLocationBtn").on("click", function (e) {   
    const id =  $(this).attr("data-id")
    $.ajax({
      url: "./libs/php/checkLocationUse.php",
      type: "GET",
      dataType: "json",
      data: {
        id
      },
      success: function (result) {
        if (result.status.code == 200) {
          if (result.data[0].departmentCount == 0) {
            $("#deleteLocationID").val(id);
            $("#deleteLocationName").text(result.data[0].locationName);
            $("#deleteLocationModal").modal("show")
          } else {
            $("#cannotDeleteLocationName").text(result.data[0].locationName)
            $("#departmentCount").text(result.data[0].departmentCount)
            $("#cannotDeleteLocationModal").modal("show")
          }
        } else {
          $("#deleteLocationModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#deleteLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      },
    });
  });
}

function fillDropdowns() {
  const departments = getArrayOfAllDepartments();
  const locations = getArrayOfAllLocations();

  const filterDepartmentFrag = document.createDocumentFragment();
  departments.forEach(function (item, index) {
    const option = document.createElement("option");
    option.value = item.id;

    const optionText = document.createTextNode(item.name);
    option.append(optionText);

    filterDepartmentFrag.append(option);
  });
  $("#filterDepartment").append(filterDepartmentFrag);

  const addPersonnelDepartmentFrag = document.createDocumentFragment();
  departments.forEach(function (item, index) {
    const option = document.createElement("option");
    option.value = item.id;

    const optionText = document.createTextNode(item.name);
    option.append(optionText);

    addPersonnelDepartmentFrag.append(option);
  });
  $("#addPersonnelDepartment").append(addPersonnelDepartmentFrag);

  const filterLocationFrag = document.createDocumentFragment();
  locations.forEach(function (item, index) {
    const option = document.createElement("option");
    option.value = item.id;

    const optionText = document.createTextNode(item.name);
    option.append(optionText);

    filterLocationFrag.append(option);
  });
  $("#filterLocation").append(filterLocationFrag);

  const addDepartmentLocationFrag = document.createDocumentFragment();
  locations.forEach(function (item, index) {
    const option = document.createElement("option");
    option.value = item.id;

    const optionText = document.createTextNode(item.name);
    option.append(optionText);

    addDepartmentLocationFrag.append(option);
  });
  $("#addDepartmentLocation").append(addDepartmentLocationFrag);
}
