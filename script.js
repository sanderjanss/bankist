'use strict';

// BANKIST APP
// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;


//------------------------------------------- DISPLAY METHODS ------------------------------------------------//

//DISPLAY DEPOSITS WITHDRAWALS
const displayMovement = function(movements, sort = false){

  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b ) => a - b) : movements;

  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type} </div>
    <div class="movements__date"></div>
    <div class="movements__value">${mov}</div>
    </div>
    
    `;

    containerMovements.insertAdjacentHTML('afterbegin',html);

  })

}


//DISPLAY TOTAL BALANCE
const calcDisplayBalance = function(accs){
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${accs.balance}€`
}

//DISPLAY SUMMARY
const calcDisplaySummary = function(accs){
  const incomes = accs.movements.filter(mov => mov > 0)
                    .reduce((acc, mov) => acc + mov, 0);
  const out = accs.movements.filter(mov => mov < 0)
                    .reduce((acc, mov) => acc + mov, 0);
  const interest = accs.movements.filter(mov => mov > 0)
                    .map(deposit => (deposit * accs.interestRate)/100)
                    .filter((int, i, arr) => {
                      return int >= 1;
                    })
                    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${incomes}€`
  labelSumOut.textContent = `${Math.abs(out)}€`
  labelSumInterest.textContent = `${interest}€`
 
}





//------------------------------------------- EVENTHANDLERS ------------------------------------------------//

btnLogin.addEventListener('click', function(e){
  //prevent form from submitting
  //hitting enter in a fieldform triggers a click event
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // DISPLAY UI AND message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}.`
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
     

    updateUI(currentAccount);

  }
  
})


//CREATE TRANSFER
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
      

  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(currentAccount.balance > amount && receiverAccount && amount > 0 && receiverAccount?.username !== currentAccount.username){
        receiverAccount.movements.push(amount);
        currentAccount.movements.push(-amount);
  }
     


  updateUI(currentAccount);

})

//CREATE LOAN
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
    
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount = '';
})

// CLOSE ACCOUNT
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  

  if((currentAccount.username === inputCloseUsername.value) && (currentAccount.pin === Number(inputClosePin.value))){
    //use a callbackfunction to loop over each account and find the index of the currentaccount
    //findIndex returns the index, and not the element itself
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    //splice mutates the array itself, delete the account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`
}

inputCloseUsername.value = inputClosePin.value = '';


})

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();

  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;

})


//CREATE USERNAMES
const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(user => user[0]).join('');
  } );
}


const updateUI = function(currentAccount){
      //DISPLAY MOVEMENTS
      displayMovement(currentAccount.movements);
      //DISPLAY BALANCE
      calcDisplayBalance(currentAccount);
      //DISPLAY SUMMARY
      calcDisplaySummary(currentAccount);

}

createUsernames(accounts);
