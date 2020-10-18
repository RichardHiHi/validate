function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  var selectorRule = {};
  var formElement = document.querySelector(options.form);

  //nếu nhập sai thi bôi đỏ còn đúng thì xóa đi

  var validate = function (inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(
      options.formMessage
    );

    console.log(errorElement);
    console.log(getParent(inputElement, options.formGroup));
    var errorMess;
    rules = selectorRule[rule.select];
    for (var i = 0; i < rules.length; i++) {
      errorMess = rules[i](inputElement.value);
      if (errorMess) {
        break;
      }
    }
    if (errorMess) {
      errorElement.textContent = errorMess;
      getParent(inputElement, options.formGroup).classList.add("invalid");
    } else {
      errorElement.textContent = "";
      getParent(inputElement, options.formGroup).classList.remove("invalid");
    }
    return !errorMess;
  };

  if (formElement) {
    formElement.onsubmit = function (e) {
      var isFormValid = true;
      e.preventDefault();
      options.rule.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.select);
        isVaild = validate(inputElement, rule);
        if (!isVaild) {
          isFormValid = false;
        }
      });
      console.log(isFormValid);
      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          var data = formElement.querySelectorAll("[name]");
          var formValue = Array.from(data).reduce(function (values, input) {
            values[input.name] = input.value;
            return values;
          }, {});
          options.onSubmit(formValue);
        }
      }
    };

    options.rule.forEach((rule) => {
      if (Array.isArray(selectorRule[rule.select])) {
        selectorRule[rule.select].push(rule.test);
      } else {
        selectorRule[rule.select] = [rule.test];
      }
      var inputElement = formElement.querySelector(rule.select);
      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroup
          ).querySelector(options.formMessage);
          var parentElement = getParent(inputElement, options.formGroup);
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

Validator.isRequired = function (selector, message) {
  return {
    select: selector,
    test: function (value) {
      return value ? undefined : message || "vui long nhap lai";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    select: selector,
    test: function (value) {
      var check = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        value
      );
      return check ? undefined : message || "vui long nhap lai";
    },
  };
};

Validator.minlength = function (selector, min, message) {
  return {
    select: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `vui lòng nhập hơn ${min} kí tự`;
    },
  };
};

Validator.isConfirmPassword = function (selector, getValueConfirm, message) {
  return {
    select: selector,
    test: function (value) {
      return value === getValueConfirm()
        ? undefined
        : message || `mat khau bam nhap khong chinh xac`;
    },
  };
};
