const lang = "ja"

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
            let p = textAnalyzer(fr.result);
            console.log(p);
            let table = document.getElementById("result");
            for (let i = 0; i < p.length; i++) {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                    td.innerText = p[i].name;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = p[i].msg;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = p[i].stamp;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = p[i].image;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = p[i].movie;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = p[i].msglength;
                    tr.appendChild(td)

                    table.append(tr);
            }
        }
    });
});



const textAnalyzer = function (text) {
    class Members {
        constructor (name){
            this.name = name;
            this.msg = 0;
            this.msglength = 0;
            this.stamp = 0;
            this.image = 0;
            this.movie = 0;
        }
    }
    
    const person = new Array();

    const rowsArr = text.split("\n");
    const header = rowsArr[0];
    const savetime = rowsArr[1];
    rowsArr.splice(0,2);
    const talk_content = rowsArr.join("\n");
    // txtArr = text.split(/20\d{2}\/\d{1,2}\/\d{1,2}\([月火水木金土日]\)\n\d{1,2}:\d{1,2}/);
    // txtArr = text.split(/\d{1,2}:\d{1,2}\t.+\t/);
    let txtArr = talk_content.split(/\d{1,2}:\d{1,2}\t/);

    switch (lang) {
        case "ja":
            txtArr.forEach(element => {
                if ( element.match(/.+が.+を招待しました|20\d{2}\/\d{1,2}\/\d{1,2}\([月火水木金土日]\)/) === null ) {
                    let name_and_msg = element.split("\t");
                    if (name_and_msg.length >= 2) {
                        let known_flag = false;
                        // known person
                        for (let i = 0; i < person.length; i++) {
                            if (person[i].name == name_and_msg[0]) {
                                known_flag = i;
                                break;
                            }
                        }
                        
                        // unknown person
                        if (known_flag === false) {
                            known_flag = person.length;
                            let p = new Members(name_and_msg[0]);
                            person.push(p);
                        }

                        let trimed_msg = name_and_msg[1].trim();
                        if (trimed_msg == "[スタンプ]") {
                            person[known_flag].stamp++;
                        } else if (trimed_msg == "[写真]") {
                            person[known_flag].image++;
                        } else if (trimed_msg == "[動画]") {
                            person[known_flag].movie++;
                        } else {
                            person[known_flag].msg++;
                            person[known_flag].msglength += name_and_msg[1].length;
                        }
                    }
                }
            });            
            break;
    
        default:
            break;
    }
    return person;
}