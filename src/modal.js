import "./modal.scss"


document.addEventListener("DOMContentLoaded", () => {
    var modal = document.getElementById("myModal")

    var btn = document.getElementById("information")

    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function(){
        modal.style.display = "block"
        console.log("clicked button")
    }

    span.onclick = function(){
        modal.style.display = "none"
    }

    window.onclick = function(event){
        if (event.target == modal){
            modal.style.display = "none";
        }
    }
})
