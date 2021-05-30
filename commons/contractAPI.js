var instantiateContract=require("../commons/ContractArtifact/instantiateContract");

class contractAPI{
    constructor(_router,_prefix,opts){
        this.opts=opts || {};
        this.prefix=_prefix;
        this.router=_router;
        this.apiHooks={};
        this.urlMapper={};
    }

    register(_contract){
        var contractAdaptor = new instantiateContract({
            web3_url:'http://127.0.0.1:8118',
            contract:_contract
        });

        let abi=contractAdaptor.Artifact.abi;
        let definition=this._generatefromABI(abi,contractAdaptor);
        this.apiHooks[_contract]=definition;
        let route=`${this.prefix}/${_contract}`;
        // this.router.get(route, function(req, res) {
        //     res.json({ message: _contract });   
        // }).post(route, function(req, res) {
        //     res.json({ message: _contract });   
        // });
    }

    async _invoke(req,res,contractAdaptor){
        let params=req.body;
        let f=this.urlMapper[req.path].funct;
        var result="";
        if(this.urlMapper[req.path].type=="write"){
            if(params.length){ //is Array
                result=await f(...params).encodeABI();
            }else{
                result=await f().encodeABI();
            }
            res.json({ tx:{
                data: result,
                to: contractAdaptor.address.address
            }});
            return;
        }else if(this.urlMapper[req.path].type=="fallback"){
            result="";
            res.json({ result:result });
            return; 
        }else{
            if(params.length){ //is Array
                result=await f(...params).call();
            }else{
                result=await f().call();
                //console.log(JSON.stringify(result));
            }
            res.json({ result:result }); 
            return;
        }  
    }

    _generatefromABI(abi,contractAdaptor){
        let defContract={};
        
        for(let k in abi){
            let v=abi[k];
            if((v.type!="function") && (v.type!="fallback")) continue;
            var name=v.name;
            var def={};
            def.name=v.name;
            if(v.type==="fallback"){
                def.name="FALLBACKCALL";
            }
            if((v.stateMutability==="view") || (v.stateMutability==="pure")){
                def.type="read";
            }else{
                if(v.type==="fallback"){
                    def.type="fallback";
                }else{
                    def.type="write";
                }
            }
            def.inputs=v.inputs;
            def.funct=contractAdaptor.methods[name];
            defContract[name]=def;
            let route=`${this.prefix}/${contractAdaptor.contractTextName}/${def.name}`;
            console.log(`Route register: [${route}]`);
            this.urlMapper[route]=def;
            this.router.get(route, async (req, res) => {
               await this._invoke(req,res,contractAdaptor);
            }).post(route, async (req, res) => {
                await this._invoke(req,res,contractAdaptor);  
            });
        }
        return defContract;
    }


    // curl -X POST -H "Content-Type: application/json" --data '["0xa85d4e79260a70926d4f37e2655eecc7c729247f"]'  http://localhost:3000/api/contracts/HeritageFactory/returnFunds

};

module.exports=contractAPI;