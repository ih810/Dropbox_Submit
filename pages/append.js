//Parent Element
const fileList = document.getElementById("fileList");
const filePreview = document.getElementById("preview-container");
let results;

//New Child Element
const newAppend = () => {
    //using ajax to fetch data from backend
    $.get("http://localhost:8080/update", (data) => {
      return data;
    })

    //when get is success, append each file name into the html
      .done((e) => {
        console.log(`append start`);
        e.forEach((file) => {
          $("#fileList").append(
          `<li class="row">
          <a class="fileName col-8" id="${file}">${file}</a>
          <a class="col-2" href="http://localhost:8080/storage/${file}"><i class="fas fa-cloud-download-alt"></i></a>
          <a class="col-2" href="http://localhost:8080/del/${file}"><i class="fas fa-trash-alt"></i></a>
        </li>`
          )
        });
      })

      //error handling
      .fail((err) => {
        console.log(err)
      })
  }

newAppend()

$("#fileSub").on("click", () => {
  //clear the whole list in html
  while (fileList.firstChild) {
    fileList.removeChild(fileList.lastChild);
  }

  //make the list again
  newAppend();
});

$(".delete-btn").on("click", () => {
  //clear the whole list in html
  while (fileList.firstChild) {
    fileList.removeChild(fileList.lastChild);
  }

  //make the list again
  newAppend();
});

$("body").on("click",".fileName", (event)=>{
  //clear the preview
  while (filePreview.firstChild){
    console.log(`remove`)
    filePreview.removeChild(filePreview.lastChild);
  }

  //append the photo
  let id = event.target.id
  $("#preview-container").append(
   `<img src="http://localhost:8080/preview/${id}" width="400px", height="500px">`
  )
})