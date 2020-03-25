const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); 
const web3 = new Web3(ganache.provider());
const {interface,bytecode} = require('../compile');

let accounts;
let lottery;
beforeEach(async () => {
    //Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data : '0x'+bytecode })
        // .send({from:accounts[0] , gas : '318721'})225455
        //  .estimateGas({from: accounts[0]});
        .send({from:accounts[0] , gas : '358650'})

    })

describe('lottery' , async () => {
    it('deploys a contract' , () => {
        // console.log(lottery.options.address);
        // console.log(lottery);
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter' , async () =>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02','ether'),
            
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        })/* .then(data => {
            players = data;
        }) */
        
        assert.equal(players[0],accounts[0]);
        assert.equal(1,players.length);
    })

    it('allows multiple accounts to enter' , async () =>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02','ether'),
            
        });

        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02','ether'),
            
        });

        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02','ether'),
            
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        })/* .then(data => {
            players = data;
        }) */
        
        assert.equal(players[0],accounts[0]);
        assert.equal(3,players.length);
    });

    // test to check if minimum amount of ether is spent
    it('minimum amount ether is required to enter lottery', async ()=>{
        try{
            await lottery.methods.enter().send({
                from : accounts[0],
                value : 0
            });
            // if somehow this is successful
            // assert(false) will fail it no matter what happens
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    // test to check who calls the pickwinner function
    
    it('only manager can call pickwinner', async ()=>{
        try{
            await lottery.methods.pickwinner.send({
                from : accounts[0]
            });
            assert(false)
        }catch(err){
            assert(err);
        }
    });

    it('sends money to the winner and resets', async ()=>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei( '2' , 'ether')
        })

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickwinner().send({from : accounts[0]})
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const differnce = finalBalance - initialBalance;

        console.log(differnce);

        assert(differnce > web3.utils.toWei('1.8' , 'ether'));

    })

});