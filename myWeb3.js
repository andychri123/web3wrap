/*
 *       MyWe3.js
 *       
 */
const DEFAULT_HTTP_PROVIDER = 'http://localhost:7545';

export default class MyWeb3 {
    /* singletone */
    static _instance = null;
    static getInstance() {
        if (!MyWeb3._instance)
            MyWeb3._instance = new MyWeb3()
        return MyWeb3._instance
    }
    /* properties */
    enabled = false;
    web3Provider = null;
    web3 = null;
    /* methods */
    constructor() {
        if (window.ethereum) {
            this.web3Provider = window.ethereum;
            window.ethereum.enable()
                .then(()=>{
                    console.log("window.etherehum enabled.")
                })
                .catch((e)=>{
                    console.error("User denied account access.", e)
                })
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            console.log("Injected web3 detected.", window.web3);
            this.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            this.web3Provider = new window.Web3.providers.HttpProvider(DEFAULT_HTTP_PROVIDER);
            console.log("new logger from new web32")
        }
        this.web3 = new window.Web3(this.web3Provider);
    }

    /* Contract Methods */
    getContract(jsonContract) {
        const contract = window.TruffleContract(jsonContract);
        contract.setProvider(this.web3Provider);
        return contract;
    }

    deployContract(contract){
        return new Promise((resolve, reject)=>{
            contract.deployed()
                .then(function(instance){
                    resolve(instance)
                })
                .catch(function(err){
                    resolve(err)
                })
        })
    }

    /*Account Methods */
    getAccounts(){
        return new Promise((resolve, reject)=>{
            this.web3.eth.getAccounts(function(err, accounts){
                if(err){
                    reject(err);
                    return;
                }
                resolve(accounts);
            })
        })
    }
}