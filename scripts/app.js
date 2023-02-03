
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

    function DisplayHomePage() {
        console.log("Home Page Called");

        $("#AboutUsBtn").on("click", () => {
            location.href = "about.html"
        });

        $("main").append(`<p id="Main Paragraph" class="mt-3" >This is the main paragraph</p>`);
        $("body").append(`<article class="container"><p id= "ArticlePragraph" class="mt-3"> This is my article paragraph 
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

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(event)
        {
            if(subscribeCheckbox.checked){
                let contact = new Contact(fullName.value, contactNumber.value, emailAddress.value);
                if(contact.serialize()){
                    let key = contact.FullName.substring(0,1) + Date.now();
                    locateStorage.setItem(key, contact.serialize());
                }
            }
        });

    }
    function DisplayContactPage(){
        console.log("Contact Us Page")

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
    function Start(){
        console.log("App Started!")
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

        }
    }
    window.addEventListener("load", Start)

})()