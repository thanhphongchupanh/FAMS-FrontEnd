function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function setCookie(name, value, hours) {
    var date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); // Thời gian sống tính bằng mili giây

    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    var cookieArray = document.cookie.split("; ");
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}
function createOptions() {
    const options = [
        "FULL_ACCESS",
        "VIEW",
        "MODIFY",
        "ACCESS_DENIED",
        "CREATE"
    ];

    let optionsHTML = "";
    for (const option of options) {
        const formattedOption = permissionMappings[option] || option;
        optionsHTML += `<option value="${option}">${formattedOption}</option>`;
    }

    return optionsHTML;
}


let tableData = [];

// Hàm để cập nhật dữ liệu trong mảng tableData khi thay đổi giá trị trong <select>
function updateData(role, field, value) {
    const user = tableData.find(item => item.role === role);
    if (user) {
        user[field] = value;
    }
}

var accessToken = getCookie("accessToken");
$(document).ready(function () {
    $.ajax({
        url: "http://localhost:8080/api/v1/usersPermission",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            tableData = response.payload;

            for (let i = 0; i < tableData.length; i++) {
                const row = document.createElement("tr");
                const rowData = tableData[i];

                const roleCell = document.createElement("td");
                if (rowData.role === "SUPER_ADMIN") {
                    roleCell.textContent = "Super admin";
                } else if (rowData.role === "CLASS_ADMIN") {
                    roleCell.textContent = "Class admin";
                }else if (rowData.role === "TRAINER") {
                    roleCell.textContent = "Trainer";
                }

                roleCell.style.color = "#000"; // Đổi màu chữ thành màu đen
                roleCell.style.fontFamily = "Inter";
                roleCell.style.fontSize = "14px";
                roleCell.style.fontStyle = "normal";
                roleCell.style.fontWeight = "700";
                roleCell.style.lineHeight = "normal";
                row.appendChild(roleCell);

                const syllabusCell = document.createElement("td");
                const syllabusSelect = document.createElement("select");
                syllabusSelect.id = `syllabus_${rowData.role}`;
                syllabusSelect.innerHTML = createOptions();
                syllabusSelect.value = rowData.syllabus;
                syllabusSelect.addEventListener("change", function () {
                    updateData(rowData.role, "syllabus", this.value);
                });
                syllabusCell.appendChild(syllabusSelect);
                row.appendChild(syllabusCell);

                const trainingProgramCell = document.createElement("td");
                const trainingProgramSelect = document.createElement("select");
                trainingProgramSelect.id = `trainingProgram_${rowData.role}`;
                trainingProgramSelect.innerHTML = createOptions();
                trainingProgramSelect.value = rowData.trainingProgram;
                trainingProgramSelect.addEventListener("change", function () {
                    updateData(rowData.role, "trainingProgram", this.value);
                });
                trainingProgramCell.appendChild(trainingProgramSelect);
                row.appendChild(trainingProgramCell);


                const classCell = document.createElement("td");
                const classSelect = document.createElement("select");
                classSelect.id = `class_${rowData.role}`;
                classSelect.innerHTML = createOptions();
                classSelect.value = rowData.closs;
                classSelect.addEventListener("change", function () {
                    updateData(rowData.role, "closs", this.value);
                });
                classCell.appendChild(classSelect);
                row.appendChild(classCell);


                const learningMaterialCell = document.createElement("td");
                const learningMaterialSelect = document.createElement("select");
                learningMaterialSelect.id = `learningMaterial_${rowData.role}`;
                learningMaterialSelect.innerHTML = createOptions();
                learningMaterialSelect.value = rowData.learningMaterial;
                learningMaterialSelect.addEventListener("change", function () {
                    updateData(rowData.role, "learningMaterial", this.value);
                });
                learningMaterialCell.appendChild(learningMaterialSelect);
                row.appendChild(learningMaterialCell);

                let userCell = document.createElement("td");
                userCell.textContent = permissionMappings[rowData.userManagement];
                const permissionIcon = document.createElement("img");
                permissionIcon.src = permissionIcons[rowData.userManagement];
                userCell.insertBefore(permissionIcon, userCell.firstChild); // Thêm biểu tượng vào trước văn bản
                row.appendChild(userCell);
                document.querySelector(".updatedContent").appendChild(row);
            }
            $("select").select2({
                templateResult: function (data) {
                    if (!data.id) {
                        return data.text;
                    }
                    const optionValue = data.id;
                    const optionText = data.text;
                    const optionImage = `<img src="${permissionIcons[optionValue]}" class="select2-option-image" />`;
                    const optionHTML = `<div>${optionImage} ${optionText}</div>`;
                    return $(optionHTML);
                }
            });

        },
        error: function (error) {
            if (error.status === 401) {
                // Trường hợp lỗi 401: Unauthorized
                // Gửi yêu cầu refreshToken để lấy accessToken mới
                var refreshToken = getCookie("refreshToken");
                $.ajax({
                    url: "http://localhost:8080/api/v1/auth/refreshToken",
                    method: "POST",
                    data: JSON.stringify({ refreshToken: refreshToken }), // Đặt refreshToken vào phần thân của yêu cầu
                    contentType: "application/json", // Xác định kiểu dữ liệu của yêu cầu
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        //Xóa cookie cũ (accessToken)
                        deleteCookie("accessToken");
                        // Lưu accessToken mới vào cookie
                        var accessTokenV2 = response.payload.accessToken;

                        setCookie("accessToken",accessTokenV2 , 1); // Ví dụ: thời gian sống 1 giờ

                        // // Xóa cookie cũ (refreshToken)
                        // deleteCookie("refreshToken");

                    },
                    error: function (refreshError) {
                        if (refreshError.status === 403) {
                            // Trường hợp lỗi 403: Forbidden
                            // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/)
                            window.location.href = "http://localhost:8081/";
                        } else {
                            // alert("Refresh token failed: " + refreshError);
                            // Xử lý lỗi khác khi refreshToken không thành công
                            window.location.href = "http://localhost:8081/";

                        }
                    }
                });
            } else {
                // alert("Error: " + error.status);
                // Xử lý lỗi khác (không phải lỗi 401)
                window.location.href = "http://localhost:8081/";
            }
        }
    });
});

$(document).ready(function () {
    $("#updateButton").click(function () {

        // Ẩn nội dung ban đầu và hiện nội dung đã cập nhật
        $("#initialContent").hide()
        $("#updatedContent").show();
    });

    $("#cancelButton").click(function () {
        // Ẩn nội dung cập nhật và hiện nội dung ban đầu
        $("#updatedContent").hide()
        $("#initialContent").show();
    });

    $("#saveButton").click(function updatePermission(e) {
        const updatedData = [];
        tableData.forEach(function (rowData) {
            const role = rowData.role;
            const syllabus = $(`#syllabus_${role}`).val();
            const trainingProgram = $(`#trainingProgram_${role}`).val();
            const closs = $(`#class_${role}`).val();
            const learningMaterial = $(`#learningMaterial_${role}`).val();

            updatedData.push({
                role: role,
                syllabus: syllabus,
                trainingProgram: trainingProgram,
                closs: closs,
                learningMaterial: learningMaterial
            });
        });
        var accessToken = getCookie("accessToken");
        $.ajax({
            url: "http://localhost:8080/api/v1/usersPermission",
            type: "PATCH",
            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            contentType: "application/json",
            data: JSON.stringify(updatedData),
            success: function (response) {

                if (response.status === "SUCCESS") {

                    $("#updatedContent").hide()
                    $("#initialContent").show();
                    // if (response.status === "SUCCESS") {
                    location.reload();
                    //     alert(response.payload);
                    // }
                }

            },
            error: function (error) {
                if (error.status === 401) {
                    // Trường hợp lỗi 401: Unauthorized
                    // Gửi yêu cầu refreshToken để lấy accessToken mới
                    var refreshToken = getCookie("refreshToken");
                    $.ajax({
                        url: "http://localhost:8080/api/v1/auth/refreshToken",
                        method: "POST",
                        data: JSON.stringify({ refreshToken: refreshToken }), // Đặt refreshToken vào phần thân của yêu cầu
                        contentType: "application/json", // Xác định kiểu dữ liệu của yêu cầu
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (response) {
                            //Xóa cookie cũ (accessToken)
                            deleteCookie("accessToken");
                            // Lưu accessToken mới vào cookie
                            var accessTokenV2 = response.payload.accessToken;

                            setCookie("accessToken",accessTokenV2 , 1); // Ví dụ: thời gian sống 1 giờ
                            updatePermission();

                        },
                        error: function (refreshError) {
                            if (refreshError.status === 403) {
                                // Trường hợp lỗi 403: Forbidden
                                // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/)
                                window.location.href = "http://localhost:8081/";
                            } else {
                                // alert("Refresh token failed: " + refreshError);
                                // Xử lý lỗi khác khi refreshToken không thành công
                                window.location.href = "http://localhost:8081/";

                            }
                        }
                    });
                } else {
                    // alert("Error: " + error.status);
                    // Xử lý lỗi khác (không phải lỗi 401)
                    window.location.href = "http://localhost:8081/";
                }
            }
        });
    });

});


$("#open-filter-dialog-button").click(() => {
    $("#filter-option-dialog")[0].showModal();
});

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function setCookie(name, value, hours) {
    var date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); // Thời gian sống tính bằng mili giây

    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    var cookieArray = document.cookie.split("; ");
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}
const permissionMappings = {
    "CREATE": "Create",
    "ACCESS_DENIED": "Access denied",
    "MODIFY": "Modify",
    "VIEW": "View",
    "FULL_ACCESS": "Full access"
};
const permissionIcons = {
    FULL_ACCESS: 'img/grade.svg', // Thay 'done' bằng tên Material Icon tương ứng
    VIEW: 'img/visibility.svg',
    MODIFY: 'img/create.svg',
    ACCESS_DENIED: 'img/visibility_off.svg',
    CREATE: 'img/add.svg'
};

$("#open-filter-dialog-button").click(() => {
    $("#filter-option-dialog")[0].showModal();
});
// $("#updateButton").click(function () {
//     window.location.href = "http://localhost:8081/updatePermission";
// });
$(document).ready(function getUserPermission() {
    $("#filter-class-location").select2({
        dropdownParent: $($("#filter-option-dialog")),
        closeOnSelect: false,
        width: "resolve"
    });
    var accessToken = getCookie("accessToken");
    $.ajax({
        url: "http://localhost:8080/api/v1/usersPermission",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (response) {
            let tableData = [];
            response.payload.forEach(element => {
                let elementArr = [];
                if (element.role === "CLASS_ADMIN") {
                    elementArr.push('<strong>Class Admin</strong>');
                } else if (element.role === "TRAINER") {
                    elementArr.push('<strong>Trainer</strong>');
                } else if (element.role === "SUPER_ADMIN") {
                    elementArr.push('<strong>Super Admin</strong>');
                }
                elementArr.push(`<img src="${permissionIcons[element.syllabus]}">` + " " + permissionMappings[element.syllabus]);
                elementArr.push(`<img src="${permissionIcons[element.trainingProgram]}">` + " " + permissionMappings[element.trainingProgram]);
                elementArr.push(`<img src="${permissionIcons[element.closs]}">` + " " + permissionMappings[element.closs]);
                elementArr.push(`<img src="${permissionIcons[element.learningMaterial]}">` + " " + permissionMappings[element.learningMaterial]);
                elementArr.push(`<img src="${permissionIcons[element.userManagement]}">` + " " + permissionMappings[element.userManagement]);
                tableData.push(elementArr);
                console.log(tableData);
            });
            $("#userPermissionTable").DataTable({
                data: tableData,
                searching: false,
                paging: false,
                info: false,
                sort: false

            });
            // getUserPermission();
        },
        error: function (error) {
            if (error.status === 401) {
                // Trường hợp lỗi 401: Unauthorized
                // Gửi yêu cầu refreshToken để lấy accessToken mới
                var refreshToken = getCookie("refreshToken");
                $.ajax({
                    url: "http://localhost:8080/api/v1/auth/refreshToken",
                    method: "POST",
                    data: JSON.stringify({ refreshToken: refreshToken }), // Đặt refreshToken vào phần thân của yêu cầu
                    contentType: "application/json", // Xác định kiểu dữ liệu của yêu cầu
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        //Xóa cookie cũ (accessToken)
                        deleteCookie("accessToken");
                        // Lưu accessToken mới vào cookie
                        var accessTokenV2 = response.payload.accessToken;

                        setCookie("accessToken",accessTokenV2 , 1); // Ví dụ: thời gian sống 1 giờ

                        // // Xóa cookie cũ (refreshToken)
                        // deleteCookie("refreshToken");

                    },
                    error: function (refreshError) {
                        if (refreshError.status === 403) {
                            // Trường hợp lỗi 403: Forbidden
                            // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/)
                            window.location.href = "http://localhost:8081/";
                        } else {
                            // alert("Refresh token failed: " + refreshError);
                            // Xử lý lỗi khác khi refreshToken không thành công
                            window.location.href = "http://localhost:8081/";

                        }
                    }
                });
            } else {
                // alert("Error: " + error.status);
                // Xử lý lỗi khác (không phải lỗi 401)
                window.location.href = "http://localhost:8081/";
            }
        }
    });
});