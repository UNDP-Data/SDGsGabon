export function wrapText(item,length){
    let returnSvgText ='';
    let tspanArray =[];
    let text = item,
		  words = text.replace('/', '/ ').split(/\s+/).reverse(),
		  //words = text.text().split(/[\\\/\s]+/).reverse(),
		  word,
		  line = [],
		  lineHeight = 1,
          tspan = '';
    while (word = words.pop()) {
		line.push(word);
		tspan = line.join(" ");
		if (tspan.length > length) {
		    line.pop();
		    tspan = line.join(" ");
            tspanArray.push(tspan)
		    line = [word];
		}
    }
    if (line.length > 0){
        tspan = line.join(" ");
        tspanArray.push(tspan)
    }
    if (tspanArray.length > 0) {
        tspanArray.forEach((d,i) => {
            returnSvgText += `<tspan x = "0em" y ="${i * lineHeight}em" >${d}</tspan>`;
        })
    }
    else returnSvgText = text;

    return returnSvgText;
}