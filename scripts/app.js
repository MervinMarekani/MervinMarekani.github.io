
(function(){

    /**
     * Instantiates a contact and stores in local storage
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     *
     */

    function AddContact(fullName, contactNumber, emailAddress){
        let contact = new Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = contact.FullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function AjaxRequest(method, url, callback){
        let Xhr = new XMLHttpRequest();

        Xhr.addEventListener("readystatechange", () => {

            if(Xhr.readyState === 4 && Xhr.status === 200)
            {
                if(typeof callback === "function") {
                    callback(Xhr.responseText);
                }else{
                    console.error("Error:callback is not a valid function.");
                }
            }

        });

        Xhr.open(method, url);
        Xhr.send();
    }
    function LoadHeader(html_data){
        $("header").html(html_data)
        $(`li>a:contains(${document.title})`).addClass("active");
    }
    function DisplayHomePage() {
        console.log("Home Page Called");

        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html"
        });

        $("main").append(`<p id="Main Paragraph" class="mt-3" >This is the main paragraph</p>`);
        $("body").append(`<article class="container"><p id= "ArticleParagraph" class="mt-3"> This is my article paragraph 
         </p> </article>`)

    }


    function DisplayProductsPage(){
        console.log("Products Page Called!")

    }
    function DisplayServicesPage(){
        console.log("Services Page Called!")

    }
    function DisplayAboutUsPage(){
        console.log("Contact Us Page")
    }


    /**
     * This function will validate an input provided based on a given regular expression
     * @param {String} input_field_id
     * @param {RegEx} regular_expression
     * @param {String} error_message
     */
    function validateField(input_field_id, regular_expression, error_message){

        let messageArea = $("#messageArea");

        $(input_field_id).on("blur", function () {

            let fullNameText = $(this).val();
            if(!regular_expression.test(fullNameText)){
                //fail validation
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();

            }else{
                //pass validation
                messageArea.removeAttr("class").hide();




            }

        });

    }

    function ContactFormValidation(){

        validateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please enter a valid first and last name (ex: John Doe" );

        validateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please enter a valid phone number (ex: 416-111-1111" );

        validateField("#emailAddress",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email address (ex: john.doe@mail.com" );

    }
    function DisplayContactPage(){
        console.log("Contact Us Page")

        ContactFormValidation();


        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(event)
        {
            let fullName = document.getElementById("fullName");
            let contactNumber = document.getElementById("contactNumber");
            let emailAddress = document.getElementById("emailAddress");

            console.log(fullName.value + contactNumber.value + emailAddress.value)

            if(subscribeCheckbox.checked){
                let contact = new Contact(fullName.value, contactNumber.value, emailAddress.value);
                if(contact.serialize()){
                    let key = contact.FullName.substring(0,1) + Date.now();
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });



    }
    function DisplayContactListPage(){
        console.log("ContactList Page");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList");
            let data = ""

            let keys = Object.keys(localStorage);  //return a string array of keys

            let index = 1;
            for(const key of keys) {
                let contactData = localStorage.getItem(key);
                let contact = new Contact();
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                         <td>${contact.FullName}</td>
                         <td>${contact.ContactNumber}</td>
                         <td>${contact.EmailAddress}</td>
                         
                         <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                           <i class="fas fa-edit fa-sm"></i> Edit</button>
                                           
                         </td>
                         
                         <td class="text-center">
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                                           <i class="fas fa-trash-alt fa-sm"></i> Delete</button>
                         </td>
                         
                         </tr>`;
                index++;

            }
            contactList.innerHTML = data;

            $("#addButton").on("click", () => {
                location.href = "edit.html#add"
            });

            $("button.edit").on("click", function()    {
                location.href = "edit.html#" + $(this).val();    })

            $("button.delete").on("click", function(){
                if(confirm("Delete contact, are you sure?")){
                    localStorage.removeItem($(this).val())

                }
                location.href = "contact-list.html"
            });
        }

    }
    function DisplayEditPage(){
        console.log("Edit Page");

        ContactFormValidation();

        let page = location.hash.substring(1);
        switch(page) {
            case "add":

                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"></i> Add`);

                $("editButton").on("click",(event) => {
                    // here

                    let fullName = document.getElementById("fullName");
                    let contactNumber = document.getElementById("contactNumber");
                    let emailAddress = document.getElementById("emailAddress");

                    event.preventDefault();
                    AddContact(fullName.value, contactNumber.value, emailAddress.value);
                    location.href = "contact-list.html";
                });
                $("#cancelButton").on("click",() => {
                    location.href = "contact-list.html";
                });

                break;
            default: {
                let contact = new Contact();
                contact.deserialize(localStorage.getItem(page));

                console.log(contact.FullName)

                // Display this contact's info in the edit form
                $("#fullName").val(contact.FullName);
                $("#contactNumber").val(contact.ContactNumber);
                $("#emailAddress").val(contact.EmailAddress);

                // When Edit Button is pressed, update the contact
                $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();

                        // Get any changes on the form
                        contact.FullName = $("fullName").val();
                        contact.ContactNumber = $("contactNumber").val();
                        contact.EmailAddress = $("emailAddress").val();

                        // Replace the item in localStorage
                        localStorage.setItem(page, contact.serialize());

                        // Return to the contact-list page
                        location.href = "contact-list.html";
                    }
                )

                // Cancel button is clicked
                $("#cancelButton").on("click", () =>
                    {
                        location.href = "contact-list.html";
                    }
                )

            }

        }
    }
    function DisplayLoginPage(){
        console.log("Login Page");

        let messageArea = $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function(){
            let success = false;
            let newUser = new core.User();

            $.get("./data/user.json", function(){
                for(const u of data.user){
                    if(username.value === u.Username && password.value === u.Password){
                        success = true;
                        newUser.fromJSON(user);
                        break
                    }
                }

                if (success){
                    sessionStorage.setItem("user",newUser.serialize());
                    messageArea.removeAttr("class").hide();

                }else{
                    //failed authentication
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger")
                        .text("Error:Invalid Credentials");
                }
            });
            $("#cancelButton").on("click",function(){
                document.form[0].reset();
                location.href = "index.html";
            });
        });


    }

    function CheckLogin(){
        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#">
                                             <i class="fas fa-sign-out-alt"></i>Logout</a>`)
        }
        $("#logout").on("click", function(){

            sessionStorage.clear();
            location.href = "login.html";

        })


    }
    function DisplayRegisterPage(){
        console.log("Register Page");
    }
    function Start(){
        console.log("App Started!");

        AjaxRequest("GET", "header.html", LoadHeader);

        switch(document.title)
        {
            case "Home":
                DisplayHomePage();
                break;
            case "Our Products":
                DisplayProductsPage();
                break;
            case "ABOUT Us":
                DisplayAboutUsPage();
                break;
            case "Our Services":
                DisplayServicesPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;

        }
    }
    window.addEventListener("load", Start)

})()