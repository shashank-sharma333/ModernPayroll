const Payroll = artifacts.require('Payroll.sol');
contract('Payroll', (accounts) => {
    it('Should add employee', async () => {
        var owner = accounts[0];
        const payroll = await Payroll.new();
        await payroll.send(99, {from: owner});
        await payroll.addEmployee(
            accounts[1],
            10
        );
        // let balance = await payroll.getBalance();
        // console.log(balance.toString());
        // const delay = ms => new Promise(res => setTimeout(res, ms)); 
        // console.log("waiting..");
        // await delay(11000);
        // console.log("waited..");
        // await payroll.getPaid({from: accounts[1]});
        // balance = await payroll.getBalance();
        // let balance = await web3.eth.getBalance(accounts[1]);
        // console.log(balance.toString());
        const employee = await payroll.getNumberOfEmployee();
        assert(employee.toString() === '1');        
    });

    it('Should remove employee', async () => {
        var owner = accounts[0];
        const payroll = await Payroll.new();
        await payroll.send(90, {from: owner});
        await payroll.addEmployee(
            accounts[1],
            1
        );
                
        var employee = await payroll.getNumberOfEmployee();
        assert(employee.toString() === '1');

        await payroll.removeEmployee(accounts[1]);
        employee = await payroll.getNumberOfEmployee();

        assert(employee.toString() === '0');
    });

    it('Should upadate employee salary', async () => {
        var owner = accounts[0];
        const payroll = await Payroll.new();
        await payroll.send(90, {from: owner});
        await payroll.addEmployee(
            accounts[1],
            10
        );
        var salary = await payroll.checkEmployee(0);
        // console.log("before: \n\n",web3.utils.fromWei(salary.salary.toString()));
        // var temp = web3.utils.toWei(salary.salary.words[0].toString());
        // console.log("\n\n",temp);
        await payroll.updateEmployee(accounts[1], 20);
        salary = await payroll.checkEmployee(0);
        // console.log("after: \n\n",salary)
        // temp = web3.utils.toWei(salary.salary.words[0].toString());
        // console.log("\n\n",salary.toString());
        assert(web3.utils.fromWei(salary.salary, 'ether').toString() === '20');
    });
});