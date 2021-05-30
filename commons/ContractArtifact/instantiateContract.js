const fs = require('fs');
var Web3 = require('web3-eth-contract');

class instantiateContract{

    constructor(opts){
        opts= opts || {};
        this.web3_url= opts.web3_url || "NOT PROVIDED WEB3_URL";
        this.contract= opts.contract || "NOT PROVIDED CONTRACT";
        Web3.setProvider('http://127.0.0.1:8118');
        this.address_directory= opts.address_directory || ".";
        this.artifact_directory=opts.artifact_directory || "./blockchain/artifacts/contracts/";
        this.address = JSON.parse(fs.readFileSync(`${this.address_directory}/${this.contract}.def`,
            {encoding:'utf8', flag:'r'}));
        this.Artifact = JSON.parse(fs.readFileSync(`${this.artifact_directory}/${this.contract}.sol/${this.contract}.json`,
            {encoding:'utf8', flag:'r'}));

        this.instance= new Web3(this.Artifact.abi, this.address.address);
        this.methods=this.instance.methods;
        this.contractTextName=this.contract;
        //this.instance.methods.changeHair("0xa85d4e79260a70926d4f37e2655eecc7c729247f").encodeABI()
    }

    
}


module.exports=instantiateContract;