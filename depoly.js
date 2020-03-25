const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const {interface , bytecode} = require('./compile');

const provider = new HDWalletProvider(
    'foil grass silent sketch prize wet forget segment barrel license vapor spoil',
    'https://rinkeby.infura.io/v3/da991de9c427481d886a0ad71c93f81d'
)

const web3 = new Web3(provider);

console.log("hello");
const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    console.log("trying to deploy from account",accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data : '0x'+ bytecode })
        .send({from : accounts[0] })

    console.log("Contract deployed to ", result.options.address);
}

deploy()