
(function(){

    /**
     * Instantiates a contact and stores in local storage
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     *
     */

    function AddContact(fullName : string, contactNumber : string, emailAddress : string){
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = contact.FullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }
    function AjaxRequest(method : string, url : string, callback : Function){
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


    function DisplayHomePage() {
        console.log("Home Page Called");

        $("#AboutUsBtn").on("click", () => {
            location.href = "/about"
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
    function validateField(input_field_id : string, regular_expression : RegExp, error_message : string){

        let messageArea = $("#messageArea");

        $(input_field_id).on("blur", function () {

            let fullNameText = $(this).val() as string;
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


        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function(event)
        {

            if(subscribeCheckbox.checked){

                let fullName = document.forms[0].fullName.value
                let contactNumber = document.forms[0].contactNumber.value
                let emailAddress = document.forms[0].emailAddress.value


                let contact = new core.Contact(fullName, contactNumber, emailAddress);
                if(contact.serialize()){
                    let key = contact.FullName.substring(0,1) + Date.now();
                    localStorage.setItem(key, contact.serialize() as string);
                }
            }
        });



    }
    function DisplayContactListPage(){
        console.log("ContactList Page");

        if(localStorage.length > 0){
            let contactList = document.getElementById("contactList") as HTMLElement;
            let data = ""

            let keys = Object.keys(localStorage);  //return a string array of keys

            let index = 1;
            for(const key of keys) {
                let contactData = localStorage.getItem(key) as string;
                let contact = new core.Contact();
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
                    localStorage.removeItem($(this).val() as string)

                }
                location.href = "/contact-list"
            });
            $("button.edit").on("click", function (){
                location.href = "/edit#" + $(this).val();
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

                    event.preventDefault();

                    let fullName = document.forms[0].fullName.value
                    let contactNumber = document.forms[0].contactNumber.value
                    let emailAddress = document.forms[0].emailAddress.value


                    AddContact(fullName.value, contactNumber.value, emailAddress.value);
                    location.href = "contact-list.html";
                });
                $("#cancelButton").on("click",() => {
                    location.href = "contact-list.html";
                });

                break;
            default: {
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page) as string);

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
                        contact.FullName = $("#fullName").val() as string;
                        contact.ContactNumber = $("#contactNumber").val() as string;
                        contact.EmailAddress = $("#emailAddress").val() as string;

                        // Replace the item in localStorage
                        localStorage.setItem(page, contact.serialize() as string);

                        // Return to the contact-list page
                        location.href = "/contact-list";
                    });


                // Cancel button is clicked
                $("#cancelButton").on("click", () =>
                    {
                        location.href = "/contact-list";
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


            $.get("./data/user.json", function(data){
                for(const user of data.user){

                    let username = document.forms[0].username.value
                    let password = document.forms[0].password.value


                    if(username === user.Username && password === user.Password){
                        success = true;
                        newUser.fromJSON(user);
                        break
                    }
                }

                if (success){
                    sessionStorage.setItem("user",newUser.serialize() as string);
                    messageArea.removeAttr("class").hide();
                    location.href = "/contact-list"

                }else{
                    //failed authentication
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger")
                        .text("Error:Invalid Credentials");
                }
            });
            $("#cancelButton").on("click",function(){
                document.forms[0].reset();
                location.href = "/home";
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
    function Display404Page(){
        console.log("404 Page")
    }

    function ActiveLinkCallback() : Function {

        switch(router.ActiveLink){

            case "home" : return DisplayHomePage;
            case "about" : return DisplayAboutUsPage;
            case "contact" : return DisplayContactPage;
            case "contact-list" : return DisplayContactListPage;
            case "products" : return DisplayProductsPage;
            case "register" : return DisplayRegisterPage;
            case "login" : return DisplayLoginPage;
            case "edit" : return DisplayEditPage;
            case "404" : return Display404Page;
            default:
                console.error("Error: callback does not exist" + router.ActiveLink);
                return new Function();
        }


    }

    function LoadHeader(){
        $.get("/views/components/header.html", function(html_data) {
            $("header").html(html_data);

            document.title = capitalizeFirstLetter(router.ActiveLink);
            $( `li>a:contains(${document.title})`).addClass("active");
            CheckLogin();
        });
    }

    function capitalizeFirstLetter(str:string){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    function LoadContent() {
        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallback();

        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data)
            callback();

        });
    }
        function LoadFooter() {
            $.get("./views/components/footer.html", function (html_data) {
                $("main").html(html_data);
            });

        }

        function Start() {
            console.log("App Started!");

            //TODO
            LoadHeader();

            LoadContent();

            LoadFooter();
        }

        window.addEventListener("load", Start)
    })()


