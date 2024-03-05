function BtnHi() {
    alert("Hi World");
}
var Button = document.getElementById("Btn-Send");
Button === null || Button === void 0 ? void 0 : Button.addEventListener("click", BtnHi);
