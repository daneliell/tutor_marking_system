const delete1 = document.getElementById("delete1")
const delete2 = document.getElementById("delete2")
const delete3 = document.getElementById("delete3")

function remove1(){
  document.getElementById("example1").remove()
}
function remove2(){
  document.getElementById("example2").remove()
}
function remove3(){
  document.getElementById("example3").remove()
}

delete1.addEventListener("click", remove1)
delete2.addEventListener("click", remove2)
delete3.addEventListener("click", remove3)
