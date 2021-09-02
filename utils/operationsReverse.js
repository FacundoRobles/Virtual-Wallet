
const reverse = (arr) =>{
    const length = arr.length - 1
    let output = []
    for(let i = length; i >= 0 ; i--){
        let element = arr.pop(arr[i]);
        output.push(element);
    }
    return output;
}

module.exports = reverse;