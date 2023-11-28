var searchedKeywords = [];

//---------------------------------------------------------------------------------------------------
// $(document).on('click', function (event) {
//     if (!$(event.target).closest('#role').length) {
//         // Đóng dialog nếu sự kiện click không nằm trong phạm vi của dialog
//         $('#role').hide();
//     }
// });
// $('#role').hide();
// $(document).on('click', '.change-role', function (event){
//
//     var position = $(this).closest('tr').position();
//     // var position = $(this).position();
//     $('#role').css({ top: position.top + 'px', right: position.right + 'px' }).show();
//
//     event.stopPropagation();
//     $('#role').show();
//
// })


//-----------------------------------------------------------------------------------------------------------------------------------------------

// Đặt sự kiện click trên nút đóng để ẩn dialog
$(document).on('click', '.close-add-user-dialog-button', function() {
    // Ẩn dialog khi nút đóng được nhấn
    $('.overlay').hide();
    $('#edit-user-dialog').hide();
});
// Bắt sự kiện gửi biểu mẫu khi nhấn nút "Save"


// ...

function myFunction(el) {
    if (el.nextElementSibling) {
        if (el.nextElementSibling.classList.contains("show")) {
            el.nextElementSibling.classList.toggle("show");
        } else {
            let dropdown = document.querySelectorAll(".dropdown-content");
            dropdown.forEach(o => o.classList.remove("show"));
            el.nextElementSibling.classList.toggle("show");
        }
    }
}


// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


//-----------------------------------------------------------------------------------------------------------------------------------------------

$(document).ready(function () {
    // Tạo mảng lưu trữ các từ khóa đã tìm kiếm


    // Khởi tạo DataTable ban đầu
    sendSearchRequest(searchedKeywords);

    // Lắng nghe sự kiện khi người dùng nhấn Enter trong ô tìm kiếm
    var input = document.getElementById("search-input");
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && input.value.trim() !== "") {
            let search = document.getElementById("search-keyword");
            let item = document.createElement("div");
            item.className = "search-item";
            const keyword = input.value.trim().toLowerCase(); // Chuyển đổi thành chữ viết thường
            item.innerHTML += `
                ${keyword}
                <span>&#10005;</span>
            `
            search.appendChild(item);
            searchedKeywords.push(keyword);
            // Gọi hàm sendSearchRequest để gửi yêu cầu AJAX
            sendSearchRequest(searchedKeywords);
            input.value = "";

            let deleteButton = item.getElementsByTagName("span")[0];
            deleteButton.addEventListener("click", () => {
                // Xóa từ khóa khỏi mảng searchedKeywords
                const index = searchedKeywords.indexOf(keyword);
                if (index !== -1) {
                    searchedKeywords.splice(index, 1);
                    if(searchedKeywords.length == 0){
                        sendSearchRequest(searchedKeywords);
                    }else
                        sendSearchRequest(searchedKeywords);
                }
                item.remove();
            });
        }
    });

    // Lắng nghe sự kiện khi người dùng xóa từ khóa
    document.querySelectorAll(".search-item").forEach(element => {
        let deleteButton = element.getElementsByTagName("span")[0];
        deleteButton.addEventListener("click", () => {
            // Xóa từ khóa khỏi mảng searchedKeywords
            const index = searchedKeywords.indexOf(element.textContent.trim());
            if (index !== -1) {
                searchedKeywords.splice(index, 1);
            }
            element.remove();
            // Gọi hàm sendSearchRequest để gửi yêu cầu AJAX khi xóa từ khóa
            sendSearchRequest(searchedKeywords);
        });
    });

    // Hàm khởi tạo DataTable

    // Hàm gửi yêu cầu AJAX với từ khóa tìm kiếm
    function sendSearchRequest(searchKeywords) {
        var url = "http://localhost:8080/api/v1/users";
        if (searchKeywords.length > 0) {
            url = "http://localhost:8080/api/v1/users/search?keyword=" + searchKeywords.join(",");
        }
        var accessToken = getCookie("accessToken");

        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            // crossDomain: true,
            success: function (response) {
                let tableData = [];
                response.payload.forEach(element => {
                    let elementArr = [];
                    let dropdownHTML = '';
                    if (element.status == true) {
                        dropdownHTML = '<div class="dropdown dropdown-last">\n' +
                            '                <a class="dropbtn" onclick="myFunction(this)" ><img src="img/more_horizontal.svg" style="pointer-events: none;"></a>\n' +
                            '                <div class="dropdown-content">\n' +
                            '                    <a class="edit">\n' +
                            '                        <img src="img/create.svg">\n' +
                            '                        Edit user</a>\n';

                        if (element.userPermission == 'TRAINER') {
                            dropdownHTML += '                    <a class="change-role-admin">\n' +
                                '                        <img src="img/role.svg">\n' +
                                '                        Change to Admin\n </a>\n';
                        } else if (element.userPermission == 'CLASS_ADMIN') {
                            dropdownHTML += '                    <a class="change-role-trainer">\n' +
                                '                        <img src="img/role.svg">\n' +
                                '                        Change to Trainer\n</a>\n';
                        }

                        dropdownHTML += '                    <a class="deactivate-user">\n' +
                            '                        <img src="img/visibility_off.svg">\n' +
                            '                        De-activate user' +
                            '<input style="display: none" type="checkbox" name="status"></a>\n' +
                            '                    <a >\n' +
                            '                        <img src="img/delete_forever.svg">\n' +
                            '                        Delete user</a>\n' +
                            '                </div>\n' +
                            '            </div>';
                    } else {
                        dropdownHTML = '<div class="dropdown dropdown-last">\n' +
                            '                <a class="dropbtn" onclick="myFunction(this)" ><img src="img/more_horizontal.svg" style="pointer-events: none;"></a>\n' +
                            '                <div class="dropdown-content">\n' +
                            '                    <a class="edit">\n' +
                            '                        <img src="img/create.svg">\n' +
                            '                        Edit user</a>\n';

                        if (element.userPermission == 'TRAINER') {
                            dropdownHTML += '                    <a class="change-role-admin">\n' +
                                '                        <img src="img/role.svg">\n' +
                                '                        Change to Admin\n </a>\n';
                        } else if (element.userPermission == 'CLASS_ADMIN') {
                            dropdownHTML += '                    <a class="change-role-trainer">\n' +
                                '                        <img src="img/role.svg">\n' +
                                '                        Change to Trainer\n</a>\n';
                        }

                        dropdownHTML += '                    <a class="activate-user">\n' +
                            '                        <img src="img/visibility.svg">\n' +
                            '                        Activate user' +
                            '<input style="display: none" type="checkbox" name="status"></a>\n' +
                            '                    <a >\n' +
                            '                        <img src="img/delete_forever.svg">\n' +
                            '                        Delete user</a>\n' +
                            '                </div>\n' +
                            '            </div>';
                    }




                    elementArr.push(element.userId);
                    elementArr.push('<strong>' + element.name + '</strong>');
                    elementArr.push(element.email);
                    elementArr.push(element.dob);
                    if (element.gender.toLowerCase() === "male") {
                        elementArr.push('<img src="img/male.png" alt="Male" title="Male" class="gender-icon">');
                    } else if (element.gender.toLowerCase() === "female") {
                        elementArr.push('<img src="img/female.png" alt="Female" title="Female" class="gender-icon">');
                    }

                    if (element.status == true){
                        elementArr.push('<p>Active</p>');
                    }else {
                        elementArr.push('<p>Inactive</p>');
                    }



                    if (element.userPermission === "CLASS_ADMIN") {
                        elementArr.push('<p class="class-admin-row name">Admin</p>');
                    }else if (element.userPermission === "TRAINER") {
                        elementArr.push('<p class="trainer-row name">Trainer</p>');
                    }else if (element.userPermission === "SUPER_ADMIN") {
                        elementArr.push('<p class="super-admin-row name">Super Admin</p>');
                    }
                    elementArr.push(dropdownHTML);
                    tableData.push(elementArr);
                    console.log(tableData);
                });

                // Khởi tạo hoặc cập nhật DataTable
                // if ($.fn.dataTable.isDataTable("#user-information-table")) {
                //     $("#user-information-table").DataTable().clear().destroy();
                // }
                //
                // $("#user-information-table").DataTable({
                //     data: tableData,
                //     searching: false,
                //     paging: true,
                //     info: false,
                //     dom: 'lrtip',
                // });
                if ($.fn.dataTable.isDataTable("#user-information-table")) {
                    $("#user-information-table").DataTable().clear().rows.add(tableData).draw();
                } else {
                    $("#user-information-table").DataTable({
                        data: tableData,
                        searching: false,
                        paging: true,
                        info: false,
                        dom: 'lrtip',
                    });
                }
            },
            error: function (error) {
                // alert(error);
                // Xử lý lỗi khi gửi yêu cầu
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

                            // Gửi lại yêu cầu gốc với accessToken mới
                            sendSearchRequest(searchKeywords);
                        },
                        error: function (refreshError) {
                            if (refreshError.status === 403) {
                                // Trường hợp lỗi 403: Forbidden
                                // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
                                // )
                                window.location.href = "http://localhost:8081/logout" +
                                    "";
                            } else {
                                alert("Refresh token failed: " + refreshError);
                                // Xử lý lỗi khác khi refreshToken không thành công
                                window.location.href = "http://localhost:8081/logout" +
                                    "";

                            }
                        }
                    });
                } else {
                    alert("Error: " + error.status);
                    // Xử lý lỗi khác (không phải lỗi 401)
                    // window.location.href = "http://localhost:8081/logout
                    // ";
                }

                //
            }
        });
    }

    $("#filter-form").submit(function (event) {
        event.preventDefault();
        console.log($(this).serializeArray());
        var arr1 = $(this).serializeArray();
        var keyValues = {};
        $.each(arr1, function (index, item) {
            // Use the "name" as the key and "value" as the value
            var key = item.name;
            var value = item.value;
            // Check if the key already exists, if so, create an array to store values
            if (keyValues.hasOwnProperty(key)) {
                keyValues[key].push(value);
            } else {
                if (key.endsWith("List")) {
                    keyValues[key] = [];
                    keyValues[key].push(value);
                } else {
                    if (value !== "") {
                        keyValues[key] = value;
                    }
                }
            }
        });
        console.log(JSON.stringify(keyValues));
    });
    $("#reset-filter-option-dialog-button").click(function (event) {
        $("#filter-class-location").val(null).trigger("change");
    });
    $("#cancel-filter-option-dialog-button").click(function (event) {
        $("#filter-class-location").val(null).trigger("change");
        $("#filter-option-dialog")[0].close();
    });
    $("#open-add-user-dialog-button").click(() => {
        $("#add-user-dialog")[0].showModal();
    });
    $("#toggle-user-status").click(function () {
        $(this).prop("disabled", true);
        if ($("#user-status-label")[0].textContent === "Active") {
            $("#user-status-label")[0].textContent = "Inactive";
        } else {
            $("#user-status-label")[0].textContent = "Active";
        }
        setTimeout(() => {
            $(this).prop("disabled", false);
        }, 150);
    });

    $("#add-user-form").submit(function (event) {
        event.preventDefault();
        $(".is-invalid").removeClass("is-invalid")
        $(".invalid-feedback").text("");
        let arr1 = $(this).serializeArray();
        let keyValues = {}
        let isValid = true;
        $.each(arr1, function (index, item) {
            let key = item.name;
            let value = item.value;
            // if (key === "name" && value.trim().length === 0) {
            //     $("#invalid-user-name").text("Invalid username");
            //     $("#input-user-name").addClass("is-invalid");
            //     isValid=false;
            // }
            // if (key === "email" && !value.trim().match(/^[a-z0-9]+@\w+\.\w+$/)) {
            //     $("#invalid-email-address").text("Invalid email address");
            //     $("#input-user-email-address").addClass("is-invalid");
            //     isValid=false;
            // }
            // if (key === "phone" && !value.trim().match(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)) {
            //     $("#invalid-phone-number").text("Invalid phone number");
            //     $("#input-user-phone").addClass("is-invalid");
            //     isValid=false;
            // }
            // if (key === "dob" && value.trim().length === 0) {
            //     $("#invalid-date-of-birth").text("Invalid date of birth");
            //     $("#pick-date-of-birth").addClass("is-invalid");
            //     isValid=false
            // }
            // if (value==="true") {
            //     value = true
            // }
            // if (value==="false"){
            //     value = false
            // }
            keyValues[key] = value;
        });

        if (isValid){
            console.log(JSON.stringify(keyValues));
            add(keyValues);

        }
    });
    function add(keyValues){
        var accessToken = getCookie("accessToken");
        $.ajax({
            url:"http://localhost:8080/api/v1/users",
            method:"POST",
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify(keyValues),
            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(){
                $("#tbpopup-1").css("display", "block");

                setTimeout(function() {
                    $("#tbpopup-1").css("display", "none");
                }, 3000);

                $("#add-user-dialog")[0].close();
                sendSearchRequest(searchedKeywords);

            },
            error:function(error) {

                errorFunction(error, add, keyValues)
                if (error.status === 400) {
                    var errorResponse = error.responseJSON;
                    console.log(error);
                    if (errorResponse && errorResponse.error) {
                        // Hiển thị thông báo lỗi cho từng trường đầu vào
                        displayFieldErrors(errorResponse.error);
                    } else {
                        // Xử lý lỗi 400 khi không có thông tin chi tiết
                        alert("Error: " + error.status);
                    }
                } else {
                    alert("Error: " + error.status);
                    // Xử lý lỗi khác (không phải lỗi 401)
                    // window.location.href = "http://localhost:8081/logout
                    // ";
                    console.log(error);
                }

                function displayFieldErrors(fieldErrors) {
                    // Hiển thị thông báo lỗi cho từng trường đầu vào
                    if (fieldErrors.email) {
                        $('#invalid-email-address').text(fieldErrors.email);
                        $("#input-user-email-address").addClass("is-invalid");
                    } else {
                        $('#invalid-email-address').text('');
                    }

                    if (fieldErrors.phone) {
                        $('#invalid-phone-number').text(fieldErrors.phone);
                        $("#input-user-phone").addClass("is-invalid");
                    } else {
                        $('#invalid-phone-number').text('');
                    }

                    if (fieldErrors.name) {
                        $('#invalid-user-name').text(fieldErrors.name);
                        $("#input-user-name").addClass("is-invalid");
                    } else {
                        $('#invalid-user-name').text('');
                    }

                    if (fieldErrors.dob) {
                        $('#invalid-date-of-birth').text(fieldErrors.dob);
                        $("#pick-date-of-birth").addClass("is-invalid");
                    } else {
                        $('#invalid-date-of-birth').text('');
                    }
                }
            }

        });

    }

//------------------------------------------------------------------------------------------------------------------------------

    function convertDateFormat(inputDate) {
        const parts = inputDate.split('/');
        if (parts.length === 3) {
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            // Chuyển đổi sang định dạng "yyyy-MM-dd"
            return `${year}-${month}-${day}`;
        }
        // Trả về giá trị ban đầu nếu không thể chuyển đổi
        return inputDate;
    }

// Bắt sự kiện click trên phần tử có class "dropbtn"
    $(document).on('click', '.edit', function() {
        // Hiển thị dialog khi "Edit user" được nhấn
        $('.overlay').show();
        $('#edit-user-dialog').show();
        $('#edit-user-dialog').css('z-index', 1000);
        var userId = $(this).closest('tr').find('td:first').text();
        var accessToken = getCookie("accessToken");
        // Gửi AJAX request để lấy thông tin chi tiết của người dùng
        $.ajax({
            url: 'http://localhost:8080/api/v1/users/' + userId, // Thay thế {id} bằng ID của người dùng
            method: 'GET',

            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                // Điền thông tin người dùng vào biểu mẫu "Edit User"
                $('#name').val(response.payload.name);
                $('#email').val(response.payload.email);
                $('#update-userPermission').val(response.payload.userPermission);
                $('#phone').val(response.payload.phone);
                var formattedDob = convertDateFormat(response.payload.dob);
                $('#dob').val(formattedDob);

                // Đặt giới tính
                if (response.payload.gender.toLowerCase() === 'male') {
                    $('#gender-male').prop('checked', true);
                } else {
                    $('#gender-female').prop('checked', true);
                }

                // Đặt trạng thái
                if (response.payload.status === true) {
                    $('#status').prop('checked', true);
                    $('#status-label').text('Active');
                } else {
                    $('#status').prop('checked', false);
                    $('#status-label').text('Inactive');
                }


                // Mở dialog
                $('#edit-user-dialog').show();
            },
            error: function(error) {
                alert(error);
            }
        });

        function updateUser(userId, updatedUserData){
            $.ajax({
                url: 'http://localhost:8080/api/v1/users/' + userId,
                method: 'PUT',
                headers: {
                    "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
                },
                xhrFields: {
                    withCredentials: true
                },
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify(updatedUserData),
                success: function(response) {

                    // Xử lý khi cập nhật thành công
                    $("#tbpopup-2").css("display", "block");

                    // Tắt thông báo sau một khoảng thời gian
                    setTimeout(function() {
                        $("#tbpopup-2").css("display", "none");
                    }, 3000); // 3 giây (3000 miligiây) sau đó tắt thông báo
                    $("#edit-user-dialog")[0].close();
                    sendSearchRequest(searchedKeywords);
                    // Cập nhật giao diện hoặc thông báo thành công
                },
                error:function(error) {

                    if (error.status === 401) {
                        // Trường hợp lỗi 401: Unauthorized
                        // Gửi yêu cầu refreshToken để lấy accessToken mới
                        var refreshToken = getCookie("refreshToken");
                        $.ajax({
                            url: "http://localhost:8080/api/v1/auth/refreshToken",
                            method: "POST",
                            data: JSON.stringify({refreshToken: refreshToken}), // Đặt refreshToken vào phần thân của yêu cầu
                            contentType: "application/json", // Xác định kiểu dữ liệu của yêu cầu
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (response) {
                                //Xóa cookie cũ (accessToken)
                                deleteCookie("accessToken");
                                // Lưu accessToken mới vào cookie
                                var accessTokenV2 = response.payload.accessToken;

                                setCookie("accessToken", accessTokenV2, 1); // Ví dụ: thời gian sống 1 giờ

                                // // Xóa cookie cũ (refreshToken)
                                // deleteCookie("refreshToken");

                                // Gửi lại yêu cầu gốc với accessToken mới
                                updateUser(userId, updatedUserData);
                            },
                            error: function (refreshError) {
                                if (refreshError.status === 403) {
                                    // Trường hợp lỗi 403: Forbidden
                                    // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
                                    // )
                                    window.location.href = "http://localhost:8081/logout" +
                                        "logout";
                                } else {
                                    alert("Refresh token failed: " + refreshError);
                                    // Xử lý lỗi khác khi refreshToken không thành công
                                    window.location.href = "http://localhost:8081/logout" +
                                        "logout";

                                }
                            }
                        });
                    } else if (error.status === 400){
                        console.log(error)
                        alert("Error: " + error.status);
                    }else {
                        alert("Error: " + error.status);
                        // Xử lý lỗi khác (không phải lỗi 401)
                        // window.location.href = "http://localhost:8081/logout
                        // ";
                        console.log(error);
                    }
                }
            });

        }
        $(document).on('click', '#submit-edit-user-dialog-button', function (event) {
            event.preventDefault();

            var updatedUserData = {
                userPermission: $('#update-userPermission').val(),
                name: $('#name').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                dob: $('#dob').val(),
                gender: $('#gender-male').is(':checked') ? 'MALE' : 'FEMALE',
                status: $('#status').prop('checked')
            };

            updateUser(userId, updatedUserData);

        });
    });

    //------------------------------------------------------------------------------------------------------------------------------

    function errorFunction(error, successFunction, ...params ){
        if (error.status === 401) {
            // Trường hợp lỗi 401: Unauthorized
            // Gửi yêu cầu refreshToken để lấy accessToken mới
            var refreshToken = getCookie("refreshToken");
            $.ajax({
                url: "http://localhost:8080/api/v1/auth/refreshToken",
                method: "POST",
                data: JSON.stringify({refreshToken: refreshToken}), // Đặt refreshToken vào phần thân của yêu cầu
                contentType: "application/json", // Xác định kiểu dữ liệu của yêu cầu
                xhrFields: {
                    withCredentials: true
                },
                success: function (response) {
                    //Xóa cookie cũ (accessToken)
                    deleteCookie("accessToken");
                    // Lưu accessToken mới vào cookie
                    var accessTokenV2 = response.payload.accessToken;

                    setCookie("accessToken", accessTokenV2, 1); // Ví dụ: thời gian sống 1 giờ

                    // // Xóa cookie cũ (refreshToken)
                    // deleteCookie("refreshToken");

                    // Gửi lại yêu cầu gốc với accessToken mới
                    successFunction(...params);
                },
                error: function (refreshError) {
                    if (refreshError.status === 403) {
                        // Trường hợp lỗi 403: Forbidden
                        // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
                        // )
                        window.location.href = "http://localhost:8081/logout" +
                            "";
                    } else {
                        alert("Refresh token failed: " + refreshError);
                        // Xử lý lỗi khác khi refreshToken không thành công
                        window.location.href = "http://localhost:8081/logout" +
                            "";

                    }
                }
            });
        }
    }
    function deactivate(userId){
        var accessToken = getCookie("accessToken");
        $.ajax({
            url: 'http://localhost:8080/api/v1/users/' + userId, // Thay thế đường dẫn tương ứng
            method: 'PUT', // Sử dụng phương thức POST để thực hiện deactivate
            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({ status: false }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                sendSearchRequest(searchedKeywords);
            },
            error:function(error){

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

                            // Gửi lại yêu cầu gốc với accessToken mới
                            deactivate(userId);
                        },
                        error: function (refreshError) {
                            if (refreshError.status === 403) {
                                // Trường hợp lỗi 403: Forbidden
                                // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
                                // )
                                window.location.href = "http://localhost:8081/logout" +
                                    "";
                            } else {
                                alert("Refresh token failed: " + refreshError);
                                // Xử lý lỗi khác khi refreshToken không thành công
                                window.location.href = "http://localhost:8081/logout" +
                                    "";

                            }
                        }
                    });
                }
                else {
                    alert("Error: " + error.status);
                    console.log(error)
                    // Xử lý lỗi khác (không phải lỗi 401)
                    // window.location.href = "http://localhost:8081/logout
                    // ";
                }
            }
        });
    }
    $(document).on('click', '.deactivate-user', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
        var userId = $(this).closest('tr').find('td:first').text();
        deactivate(userId);

    });

    function active(userId){
        var accessToken = getCookie("accessToken");
        $.ajax({
            url: 'http://localhost:8080/api/v1/users/' + userId, // Thay thế đường dẫn tương ứng
            method: 'PUT', // Sử dụng phương thức POST để thực hiện deactivate
            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({ status: true }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                sendSearchRequest(searchedKeywords);
            },
            error:function(error){

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

                            // Gửi lại yêu cầu gốc với accessToken mới
                            active(userId);
                        },
                        error: function (refreshError) {
                            if (refreshError.status === 403) {
                                // Trường hợp lỗi 403: Forbidden
                                // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
                                // )
                                window.location.href = "http://localhost:8081/logout" +
                                    "";
                            } else {
                                alert("Refresh token failed: " + refreshError);
                                // Xử lý lỗi khác khi refreshToken không thành công
                                window.location.href = "http://localhost:8081/logout" +
                                    "";

                            }
                        }
                    });
                } else {
                    // alert("Error: " + error.status);
                    // Xử lý lỗi khác (không phải lỗi 401)
                    window.location.href = "http://localhost:8081/logout" +
                        "";
                }
            }
        });
    }
    $(document).on('click', '.activate-user', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết

        var userId = $(this).closest('tr').find('td:first').text();
        active(userId);


    });

    function changeTrainer(userId){
        var accessToken = getCookie("accessToken");
        $.ajax({
            url: 'http://localhost:8080/api/v1/users/' + userId, // Thay thế đường dẫn tương ứng
            method: 'PUT', // Sử dụng phương thức POST để thực hiện deactivate
            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({ userPermission: "TRAINER" }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                sendSearchRequest(searchedKeywords);
            },
            error:function(error){

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

                            // Gửi lại yêu cầu gốc với accessToken mới
                            changeTrainer(userId);
                        },
                        error: function (refreshError) {
                            if (refreshError.status === 403) {
                                // Trường hợp lỗi 403: Forbidden
                                // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
                                // )
                                window.location.href = "http://localhost:8081/logout" +
                                    "";
                            } else {
                                alert("Refresh token failed: " + refreshError);
                                // Xử lý lỗi khác khi refreshToken không thành công
                                window.location.href = "http://localhost:8081/logout" +
                                    "";

                            }
                        }
                    });
                } else {
                    // alert("Error: " + error.status);
                    // Xử lý lỗi khác (không phải lỗi 401)
                    window.location.href = "http://localhost:8081/logout" +
                        "";
                }
            }
        });
    }
    $(document).on('click', '.change-role-trainer', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết

        var userId = $(this).closest('tr').find('td:first').text();
        changeTrainer(userId);


    });

    function changeAdmin(userId){
        var accessToken = getCookie("accessToken");
        $.ajax({
            url: 'http://localhost:8080/api/v1/users/' + userId, // Thay thế đường dẫn tương ứng
            method: 'PUT', // Sử dụng phương thức POST để thực hiện deactivate
            headers: {
                "Authorization": "Bearer " + accessToken // Sử dụng Bearer token nếu cần
            },
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({ userPermission: "CLASS_ADMIN" }),
            contentType: "application/json; charset=utf-8",
            success: function(response) {
                sendSearchRequest(searchedKeywords);
            },
            error:function(error){

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

                            // Gửi lại yêu cầu gốc với accessToken mới
                            changeAdmin(userId);
                        },
                        error: function (refreshError) {
                            if (refreshError.status === 403) {
                                // Trường hợp lỗi 403: Forbidden
                                // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
                                // )
                                window.location.href = "http://localhost:8081/logout" +
                                    "";
                            } else {
                                alert("Refresh token failed: " + refreshError);
                                // Xử lý lỗi khác khi refreshToken không thành công
                                window.location.href = "http://localhost:8081/logout" +
                                    "";

                            }
                        }
                    });
                } else {
                    // alert("Error: " + error.status);
                    // Xử lý lỗi khác (không phải lỗi 401)
                    window.location.href = "http://localhost:8081/logout" +
                        "";
                }
            }
        });
    }
    $(document).on('click', '.change-role-admin', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết

        var userId = $(this).closest('tr').find('td:first').text();
        changeAdmin(userId);


    });

    //     function changeUserPermission(userId, userPermission) {
    //     var accessToken = getCookie("accessToken");
    //     var url = "http://localhost:8080/api/v1/users/" + userId;
    //     var newPermission = (userPermission !== "TRAINER") ? "CLASS_ADMIN" : "TRAINER";
    //     // var newPermission = (userPermission === "TRAINER") ? "CLASS_ADMIN" : (userPermission === "CLASS_ADMIN") ? "TRAINER" : userPermission;
    //     $.ajax({
    //         url: url,
    //         method: "PUT",
    //         headers: {
    //             "Authorization": "Bearer " + accessToken
    //         },
    //         data: JSON.stringify({ userPermission: newPermission }),
    //         contentType: "application/json",
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         success: function(response) {
    //             // Gọi callback sau khi thay đổi userPermission thành công
    //             sendSearchRequest(searchedKeywords);
    //         },
    //         error:function(error){
    //
    //             if (error.status === 401) {
    //                 // Trường hợp lỗi 401: Unauthorized
    //                 // Gửi yêu cầu refreshToken để lấy accessToken mới
    //                 var refreshToken = getCookie("refreshToken");
    //                 $.ajax({
    //                     url: "http://localhost:8080/api/v1/auth/refreshToken",
    //                     method: "POST",
    //                     data: JSON.stringify({ refreshToken: refreshToken }), // Đặt refreshToken vào phần thân của yêu cầu
    //                     contentType: "application/json", // Xác định kiểu dữ liệu của yêu cầu
    //                     xhrFields: {
    //                         withCredentials: true
    //                     },
    //                     success: function (response) {
    //                         //Xóa cookie cũ (accessToken)
    //                         deleteCookie("accessToken");
    //                         // Lưu accessToken mới vào cookie
    //                         var accessTokenV2 = response.payload.accessToken;
    //
    //                         setCookie("accessToken",accessTokenV2 , 1); // Ví dụ: thời gian sống 1 giờ
    //
    //                         // // Xóa cookie cũ (refreshToken)
    //                         // deleteCookie("refreshToken");
    //
    //                         // Gửi lại yêu cầu gốc với accessToken mới
    //                         changeUserPermission(userId, userPermission);
    //                     },
    //                     error: function (refreshError) {
    //                         if (refreshError.status === 403) {
    //                             // Trường hợp lỗi 403: Forbidden
    //                             // Chuyển hướng trình duyệt đến trang khác (ví dụ: http://localhost:8081/logout
    //                             )
    //                             window.location.href = "http://localhost:8081/logout
    //                             ";
    //                         } else {
    //                             alert("Refresh token failed: " + refreshError);
    //                             // Xử lý lỗi khác khi refreshToken không thành công
    //                             window.location.href = "http://localhost:8081/logout
    //                             ";
    //
    //                         }
    //                     }
    //                 });
    //             } else {
    //                 // alert("Error: " + error.status);
    //                 // Xử lý lỗi khác (không phải lỗi 401)
    //                 window.location.href = "http://localhost:8081/logout
    //                 ";
    //             }
    //         }
    //     });
    // }
    // $(document).on('click', '.change-role', function(event) {
    //     event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    //
    //     var userId = $(this).closest('tr').find('td:first').text();
    //     var userPemission = $(this).closest('tr').find('td:eq(7)').text();
    //     changeUserPermission(userId, userPemission);
    //
    //
    // });

});


//-----------------------------------------------------------------------------------------------------------------------------------------------
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

$("#input-user-name").click(function () {
    $(this).removeClass("is-invalid");
});
$("#input-user-email-address").click(function () {
    $(this).removeClass("is-invalid");
});
$("#input-user-phone").click(function () {
    $(this).removeClass("is-invalid");
});
$("#pick-date-of-birth").click(function () {
    $(this).removeClass("is-invalid");
});
$(".close-add-user-dialog-button").click(function (event) {
    event.preventDefault();
    $(".is-invalid").removeClass("is-invalid")
    $(".invalid-feedback").text("");
    $("#add-user-form")[0].reset();
    $("#add-user-dialog")[0].close();
});



