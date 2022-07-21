function Validate(options) {
    function getParent(element,selector) {  
        while (element.parentElement) {
           if (element.parentElement.matches(selector)) {
                return element.parentElement
           }
           element = element.parentElement
        }

    }


    var selectorRules = {}
    // Hàm thực hiện Validate
    function checkValidate(inputElement,rule) {
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        // Lặp qua từng rule và kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for (i=0; i<rules.length;++i) {
            var errorMessage = rules[i](inputElement.value)
            if (errorMessage) break;
        }

                
                if (errorMessage) {
                    errorElement.innerText = errorMessage
                    getParent(inputElement,options.formGroupSelector).classList.add("invalid")
                } 
                else {
                    errorElement.innerText = ""
                    getParent(inputElement,options.formGroupSelector).classList.remove("invalid")
                    
                }

        return !errorMessage
        
    }
    var formElement = document.querySelector(options.form)
    
    if (formElement) {
        // Khi submit form, không bị submit
        formElement.onsubmit = function(e) {
            e.preventDefault()
            var isFormValid = true
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var ischeckValid = checkValidate(inputElement,rule)
                if(!ischeckValid) {
                    isFormValid = false
                }
            })

            if (isFormValid) {
            
                    var EnableInputs = formElement.querySelectorAll("[name]")
                    var formValues = Array.from(EnableInputs).reduce(function(values,input) {
                        values[input.name] = input.value
                        return values
                    }, {})
                    options.onSubmit(formValues)

                
            } else {
                console.log("Có lỗi")
            }
            
        }
        options.rules.forEach(function(rule) {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }
            
            

           var inputElement = formElement.querySelector(rule.selector)
           
           if (inputElement) {
            // Xử lý trường hợp blur ra khỏi input
            inputElement.onblur = function() {
                checkValidate(inputElement,rule)
            }

            // Xử lý khi người dùng nhập vào input
            inputElement.oninput = function () {
                var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(".form-message")
                errorElement.innerText = ""
                getParent(inputElement,options.formGroupSelector).classList.remove("invalid")
            }
           }
           
          
        })
    }
    
}

Validate.isRequired = function(selector) {
    return {
        selector: selector,
        test : function(value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này"
        }
    }
}

Validate.isEmail = function(selector) {
    return {
        selector: selector,
        test : function(value) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? undefined : "Vui lòng nhập email hợp lệ"
        }
    }
}

Validate.minLength = function(selector,min) {
    return {
        selector: selector,
        test : function(value) {
            return value.length >= min ? undefined : "Vui lòng nhập đủ 6 kí tự";
        }
    }
}

Validate.isPasswordCorrect = function(selector,checkCorrect) {
    return {
        selector: selector,
        test : function(value) {
            return value === checkCorrect() ? undefined : "Vui lòng nhập mật khẩu trùng";
        }
    }
}