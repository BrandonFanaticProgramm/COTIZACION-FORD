function BtnHi() : void {

    alert("Hi World");
}


const Button : HTMLElement | null = document.getElementById("Btn-Send");


Button?.addEventListener("click",BtnHi);