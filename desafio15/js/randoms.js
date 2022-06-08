process.send('start');
process.on('message',(cant)=>{
    process.send(generarRandom(cant));
})

function generarRandom(cantidad){

    const canti = parseInt(cantidad)
    let cant = 0;
    const nums = [];
    const objNum = {};
    
    if(isNaN(canti)){
        cant = 100000000;
    }else{
        cant = canti;
    }

    for (let i = 0; i < cant; i++) {
        let num = Math.floor(Math.random() * (1001 - 1)+1);
        nums.push(num);
        objNum[num] ? objNum[num]++ : objNum[num] = 1;
    }
    return objNum;
}

// class Random{

//     constructor(){
//     }
    
//     generarRandom(cantidad){
//         let cant = 0;
//         const nums = [];
//         const objNum = {};

//         cantidad ? cant = parseInt(cantidad) : cant = 100000000;

//         for (let i = 0; i < cant; i++) {
//             let num = Math.floor(Math.random() * (1001 - 1)+1);
//             nums.push(num);
//             objNum[num] ? objNum[num]++ : objNum[num] = 1;
//         }
//         return objNum;
//     }

// }

// module.exports = Random;