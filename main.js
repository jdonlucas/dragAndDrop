/* Drop events */
let droppedFiles = [];

function allowDrop(ev) {
    ev.target.parentElement.setAttribute("drop-active", true);
    ev.preventDefault();
}

function leaveDropZone(ev) {
    ev.target.parentElement.removeAttribute("drop-active");
}

function drop(ev) {
    ev.preventDefault();
    ev.target.parentElement.removeAttribute("drop-active");
    filterFilesAndDirs(ev.dataTransfer.items)
}

/* Enable/disable dropped file list */
function isEmpty() {
    if (droppedFiles.length) {
        document
            .getElementById("file")
            .labels[0].setAttribute("enable-button", true);
        document.getElementById("contentBox").setAttribute("drop-hidden", true);
        document.getElementById("elementsList").style.display = "block";
    } else {
        document.getElementById("file").labels[0].removeAttribute("enable-button");
        document.getElementById("contentBox").removeAttribute("drop-hidden");
        document.getElementById("elementsList").style.display = "none";
    }
}

/* Select Files by click on button */
const inputField = document.querySelector("#file");

inputField.addEventListener("input", (event) => {
    filterFilesAndDirs(event.target.files)
});
isEmpty();

/* Add files or directories */
function filterFilesAndDirs(files) {
    try {
        for (let i = 0; i < files.length; i++) {
            let file = files[i].webkitGetAsEntry();

            if(file) {
                scanFiles(file, files[i]);
            }
        }
    } catch {
        for (let i = 0; i < files.length; i++) {
            if (files[i].type) { // if it has mimetype, is a file
                addFile(files[i])
            } else {
                // if not, maybe a unknown file or dir
                try { // check first bytes of file, if error then is a directory 
                    new FileReader().readAsBinaryString(files[i].slice(0, 5));
    
                    addFile(files[i]); // if no exception is definitely a file
                } catch ( e ) {
    
                }
            }
        }
    }
}

function scanFiles(item, file) {
    if (item.isFile) {
        addFile(file.getAsFile())
    } else if (item.isDirectory) {
        let directoryReader = item.createReader();
        directoryReader.readEntries(entries => {
            entries.forEach(entry => {
                entry.file(function(file) {
      				addFile(file);
    			})
            });
        })
    }
}

function addFile(file) {
    let list = document.getElementById("list");
    droppedFiles.push(file);
    let x = document.createElement("LI");
    let div = document.createElement("DIV");
    let y = document.createTextNode(file.name);
    div.appendChild(y);
    x.appendChild(div);
    div = document.createElement("DIV");
    y = document.createTextNode(file.size / 1000 + "kB");
    div.appendChild(y);
    x.appendChild(div);
    list.appendChild(x);

    isEmpty();
}
