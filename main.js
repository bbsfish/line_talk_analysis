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
            let result = textAnalyzer(fr.result);
            console.log(result);
            let div = document.getElementById("result");
            let table = document.createElement("table");
            let caption = document.createElement("caption");
                caption.innerText = result[0].replace("[LINE] ", "");
                table.appendChild(caption);
            let h_tr = document.createElement("tr");
                h_tr.className = "table-headers";
            let th1 = document.createElement("th"); th1.innerText = "Names";
            let th2 = document.createElement("th"); th2.innerHTML = "Message<br>(Text only)";
            let th3 = document.createElement("th"); th3.innerText = "Stamp";
            let th4 = document.createElement("th"); th4.innerText = "Photo";
            let th5 = document.createElement("th"); th5.innerText = "Video";
            let th6 = document.createElement("th"); th6.innerHTML = "Word<br>length";
            let th7 = document.createElement("th"); th7.innerHTML = "length<br>per Msg.";
                h_tr.appendChild(th1); h_tr.appendChild(th2); h_tr.appendChild(th3);
                h_tr.appendChild(th4); h_tr.appendChild(th5); h_tr.appendChild(th6);
                h_tr.appendChild(th7);
                table.append(h_tr);
            for (let i = 0; i < result[2].length; i++) {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                    td.innerText = result[2][i].name;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = result[2][i].msg;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = result[2][i].stamp;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = result[2][i].image;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = result[2][i].movie;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = result[2][i].msglength;
                    tr.appendChild(td)

                    td = document.createElement("td");
                    td.innerText = result[2][i].msglength / result[2][i].msg | 0;
                    tr.appendChild(td)

                    table.append(tr);
            }
            div.appendChild(table);
        }
    });
});

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

const textAnalyzer = function (text) {    
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
    return new Array(header, savetime, person);
}