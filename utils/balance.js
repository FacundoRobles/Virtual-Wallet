
const balance = (arr) =>{
    let output = 0
    for(let obj of arr){
        if(obj.type === 'income')
            output += obj.value;
        if(obj.type === 'outcome')
            output -= obj.value
    }
    return output;
}

module.exports = balance;