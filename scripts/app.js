
(function(){

    function DisplayHomePage()
    {
        let AboutUsButton = document.getElementById("AboutUsBtn")
        AboutUsButton.addEventListener("click", function(){
            location.href = "about.html"
        });

    }

    function DisplayProductsPage(){

    }
    function DisplayServicesPage(){

    }
    function DisplayAboutUsPage(){

    }
    function DisplayContactPage(){

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
        }
    }
    window.addEventListener("load", Start)

})()