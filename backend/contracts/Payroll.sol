// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Payroll is Ownable{
    // attaching SafeMath library to uint
    // https://ethereum.stackexchange.com/questions/25829/meaning-of-using-safemath-for-uint256
    using SafeMath for uint;
    uint public test_balance;
    // constructor() public {
    //     test_balance = address(this).balance;
    // }
    // defining the struct for employee data
    struct Employee {
        address payable id;
        uint salary;
        uint lastPayDay;
    }

    uint constant payDuration = 10 seconds;

    uint totalSalary;
    uint public totalEmployee = 0;
    address payable[] employeeList;
    mapping(address => Employee) public employees;

    event NewEmployee(
        address payable employee
    );
    event UpdateEmployee(
        address payable employee
    );
    event RemoveEmployee(
        address payable employee
    );
    event NewFund(
        uint balance
    );
    event GetPaid(
        address payable employee
    );

    modifier employeeExit(address payable employeeId) {
        Employee storage employee = employees[employeeId];
        require(employee.id != payable(address(0x0)));
        _;
    }

    function _partialPaid(Employee memory employee) public {
        uint payment = employee.salary.mul(block.timestamp.sub(employee.lastPayDay)).div(payDuration);
        employee.id.transfer(payment);
    }

    function checkEmployee(uint index) public view returns (address payable employeeId, uint salary, uint lastPayday) {
        employeeId = employeeList[index];
        Employee storage employee = employees[employeeId];
        salary = employee.salary;
        lastPayday = employee.lastPayDay;
    }


    function addEmployee(address payable employeeId, uint salary) public onlyOwner {
        Employee storage employee = employees[employeeId];
        require(employee.id == payable(address(0x0)));

        employees[employeeId] = Employee(employeeId, salary.mul(1 ether), block.timestamp);
        totalSalary = totalSalary.add(employees[employeeId].salary);
        totalEmployee = totalEmployee.add(1);
        employeeList.push(employeeId);
        emit NewEmployee(employeeId);
    }

    function removeEmployee(address payable employeeId) public onlyOwner employeeExit(employeeId) {
        Employee storage employee = employees[employeeId];
        _partialPaid(employee);
        totalSalary = totalSalary.sub(employee.salary);
        delete employees[employeeId];
        totalEmployee = totalEmployee.sub(1);
        emit RemoveEmployee(employeeId);
    }

    function updateEmployee(address payable employeeId, uint salary) public onlyOwner employeeExit(employeeId){
        Employee storage employee = employees[employeeId];
        _partialPaid(employee);
        employee.salary = salary.mul(1 ether);
        employee.lastPayDay = block.timestamp;
        totalSalary = totalSalary.add(employee.salary);
        emit UpdateEmployee(employeeId);
    }

    function addFund() external payable returns (uint) {
        emit NewFund(address(this).balance);
        return address(this).balance; 
    }

    function calculateRunway() public view returns (uint) {
        return address(this).balance.div(totalSalary);
    }

    function hasEnoughFund() public view returns (bool) {
        return calculateRunway() > 0;
    }

    function getPaid() public employeeExit(payable(msg.sender)) {
        Employee storage employee = employees[payable(msg.sender)];

        uint nextPayDay = employee.lastPayDay.add(payDuration);
        require(nextPayDay < block.timestamp);

        employee.lastPayDay = nextPayDay;
        employee.id.transfer(employee.salary);
        emit GetPaid(employee.id);
    }

    function checkInfo() public view returns (uint balance, uint runway, uint employeeCount){
        balance = address(this).balance;
        employeeCount = totalEmployee;
        if (totalSalary > 0){
            runway = calculateRunway();
        }
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getNumberOfEmployee() public view returns (uint){
        return totalEmployee;
    }

    receive() external payable {}

}