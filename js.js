function Validator(options) {
  var formElement = document.querySelector(options.form);

  //nếu nhập sai thi bôi đỏ còn đúng thì xóa đi

  var validate = function (inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(
      options.formMessage
    );
    var parentElement = inputElement.parentElement;
    var errorMess = rule.test(inputElement.value);
    if (errorMess) {
      errorElement.textContent = errorMess;
      parentElement.classList.add("invalid");
    } else {
      errorElement.textContent = "";
      parentElement.classList.remove("invalid");
    }
  };

  if (formElement) {
    options.rule.forEach((rule) => {
      var inputElement = formElement.querySelector(rule.select);

      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.formMessage
          );
          var parentElement = inputElement.parentElement;
          errorElement.innertext = "";
          parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

//định nghĩa rule
//nguyên tắc của các rule
//1,khi có lỗi = trả về 1 mess erro
//2.khi không có lỗi thì không trả về cái gì cả

Validator.isRequired = function (selector) {
  return {
    select: selector,
    test: function (value) {
      return value ? undefined : "vui long nhap lai";
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    select: selector,
    test: function (value) {
      var check = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        value
      );
      return check ? undefined : "vui long nhap lai";
    },
  };
};
