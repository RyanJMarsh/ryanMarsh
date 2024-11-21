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
  fillPersonnelList();

  $("#searchInp").on("keyup", function () {
    // your code
  });

  $("#refreshBtn").on("click", function () {
    if ($("#personnelBtn").hasClass("active")) {
      // Refresh personnel table
      fillPersonnelList();
    } else {
      if ($("#departmentsBtn").hasClass("active")) {
        // Refresh department table
        fillDepartmentsList();
      } else {
        // Refresh location table
      }
    }
  });

  $("#filterBtn").on("click", function () {
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  });

  $("#addBtn").on("click", function () {
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  });

  $("#personnelBtn").on("click", function () {
    // Call function to refresh personnel table
    fillPersonnelList();
  });

  $("#departmentsBtn").on("click", function () {
    // Call function to refresh department table
    fillDepartmentsList();
  });

  $("#locationsBtn").on("click", function () {
    // Call function to refresh location table
  });

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted

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

  // Executes when the form button with type="submit" is clicked

  $("#editPersonnelForm").on("submit", function (e) {
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour

    e.preventDefault();

    // AJAX call to save form data
  });
  $("#searchInp").on("keyup", function () {
    // your code
  });

  $("#refreshBtn").on("click", function () {
    if ($("#personnelBtn").hasClass("active")) {
      // Refresh personnel table
    } else {
      if ($("#departmentsBtn").hasClass("active")) {
        // Refresh department table
      } else {
        // Refresh location table
      }
    }
  });

  $("#filterBtn").on("click", function () {
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  });

  $("#addBtn").on("click", function () {
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
  });

  $("#personnelBtn").on("click", function () {
    // Call function to refresh personnel table
  });

  $("#departmentsBtn").on("click", function () {
    // Call function to refresh department table
  });

  $("#locationsBtn").on("click", function () {
    // Call function to refresh location table
  });

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "./libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id"),
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted

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

  // Executes when the form button with type="submit" is clicked

  $("#editPersonnelForm").on("submit", function (e) {
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour

    e.preventDefault();

    // AJAX call to save form data
  });
});

function fillPersonnelList() {
  $("#personnelTableBody").empty();
  $.ajax({
    url: "./libs/php/getAll.php",
    type: "GET",
    success: function (result) {
      if (result.status.code == "200") {
        const personnelList = result.data;
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
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnelList[i].id}">
                  <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `);
        }
      }
    },
  });
}

function fillDepartmentsList() {
  $("#departmentTableBody").empty();
  $.ajax({
    url: "./libs/php/getAllDepartments.php",
    type: "GET",
    success: function (result) {
      if (result.status.code == "200") {
        const departmentsList = result.data;
        
        
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
                    <button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="${departmentsList[i].id}">
                      <i class="fa-solid fa-trash fa-fw"></i>
                    </button>
                  </td>
                </tr>
          `);
        }
          
      }
    },
  });
}
