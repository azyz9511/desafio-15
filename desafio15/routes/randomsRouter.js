const express = require('express');
const router = express.Router();
const {fork} = require('child_process');

router.get('/',(req, res) => {
    if(!isNaN(req.query.cant) || !req.query.cant){
        const forked = fork('./js/randoms');
        forked.on('message',(msg) => {
            if(msg == 'start'){
                forked.send(`${req.query.cant}`);
            }else{
                res.json({"Numeros Random" : msg});
            }
        })
    }else{
        res.send({Error: 'por favor ingresar un numero'});
    }
});

module.exports = router;