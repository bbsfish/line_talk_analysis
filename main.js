window.addEventListener("load", () => {
    const elem = document.getElementById("file_input");
    elem.addEventListener("change", event => {
        console.log(event.target);
        let input = event.target;
        if (input.files.length == 0) {
            console.log('No file selected');
            return;
        }
        const file = input.files[0];
        const fr = new FileReader();
        fr.readAsText(file);
        fr.onload = () => {
            textAnalyzer(fr.result);
        }
    });
});


const textAnalyzer = function (text) {
    // console.log(text);
    
}