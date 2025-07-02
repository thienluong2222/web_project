//thêm code js của các trang
//js của trang Dang ky//

//Lấy Element của trang đăng ký//
const formdangky = document.getElementById("formdangky")
const UserNameElement = document.getElementById("UserName")
const EmailElement = document.getElementById("email")
const sdtElement = document.getElementById("sdt")
const passwordElement = document.getElementById("InputPassword")
const repasslElement = document.getElementById("ReInputPassword")

//Element liên quan đến lỗi//
const errorUserName = document.getElementById("errorUserName")
const errorEmail = document.getElementById("errorEmail")
const errorSdt = document.getElementById("errorSdt")
const errorPassword = document.getElementById("errorPassword")
const errorRePassword = document.getElementById("errorRePassword")

/**
 * Validate địa chỉ Email
 * @param {*} email : Chuỗi email người dùng nhập vào 
 * @returns : Dữ liệu nếu email đúng định dạng, undefined nếu email không đúng định dạng
 * Author: NVQUY (16/2/2024)
 */
//Nguồn: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript//
function validateEmail (email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


formdangky.addEventListener("submit", function(e){
    e.preventDefault()

    if ( !UserNameElement.value){
        errorUserName.style.display="block"  //Hiển thị lỗi//
    }
    else
        errorUserName.style.display="none"   //Ẩn lỗi khi nhập đúng nè//

     if ( !EmailElement.value){
        errorEmail.style.display="block"
    }
    else
        errorEmail.style.display="none"
    //Kiểm tra định dạng Email
    if (!validateEmail(EmailElement.value)){
        errorEmail.style.display="block"
        errorEmail.innerHTML="Email không đúng định dạng"
    }

    
     if ( !sdtElement.value){
        errorSdt.style.display="block"
    }
    else
        errorSdt.style.display="none"

     if ( !passwordElement.value){
        errorPassword.style.display="block"
    }
    else
        errorPassword.style.display="none"

     if ( !repasslElement.value){
        errorRePassword.style.display="block"
    }
    else
        errorRePassword.style.display="none"

    //Kiểm tra mật khẩu với nhập lại mật khẩu có trùng hay không//
    if (passwordElement.value !== repasslElement.value){
        errorRePassword.style.display="block";
        errorRePassword.innerHTML ="Mật khẩu không khớp";
    } else  {
        errorRePassword.style.display="none";
    }
    
    //Gửi dữ liệu 
    if(UserNameElement.value && EmailElement.value 
        && sdtElement.value && passwordElement.value 
        && repasslElement.value 
        && passwordElement.value === repasslElement.value
        && validateEmail(EmailElement.value) ){
            //Lấy dữ liệu và tạo thành user
            const user= {
                userID: 
            }
        }
});