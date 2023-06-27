'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Alioune FAll',//Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-06-05T17:01:17.194Z',
    '2023-06-08T23:36:17.929Z',
    '2023-06-11T10:51:36.790Z',
  ],
  currency: 'FCFA',
  locale: 'UTC', // de-DE
};
 

const account2 = {
  owner: 'Sokhna Maty Dieye', //'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-05-10T14:43:26.374Z',
    '2023-06-09T18:49:59.371Z',
    '2023-06-011T12:01:20.894Z',
  ],
  currency: 'FCFA',
  locale: 'UTC',
};

const account3 = {
  owner:  'Sakkay Ayoub', //'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Hasnaa Idrissi',
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


//Functions

const formatMovementDate = function(date, locale) {
  const calcDaysPassed = (date1, date2) => 
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if(daysPassed === 0) return 'Aujourdhui';
  if(daysPassed === 1) return 'Hier';
  if(daysPassed <= 7) return `Il y'a ${daysPassed} jours`;


    // const day = `${date.getDate()}`.padStart(2,0);
    // const month = `${date.getMonth() + 1}`.padStart(2,0);
    // const year = date.getFullYear();
    //  return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
} 

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements; 

  movs.forEach((mov, i) => {
    
    const type = mov > 0 ? 'dépôt' : 'retrait';

    const date =   new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);


    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${mov.toFixed(2)}FCFA</div>
      </div>
    `
    containerMovements.insertAdjacentHTML("afterbegin", html);

  });
}

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) =>
     acc + mov, 
 0);

 labelBalance.textContent = `${acc.balance.toFixed(2)} FCFA`;
};

const calcDisplaySummary = function(acc) {
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes.toFixed(2)}FCFA`

    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov,0);
    labelSumOut.textContent = `${Math.abs(out).toFixed(2)}FCFA`

    const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
        return int > 1;
    })
    .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}FCFA`

}


const createUserNames = function(accs){
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLocaleLowerCase().split(' ').map(name => name[0]
      ).join('');
  })
 
}

createUserNames(accounts);

const updateUI = function(acc) {
  // Display movements
displayMovements(acc);
// Display balance
calcDisplayBalance(acc);

// Display summary
calcDisplaySummary(acc);  
}

const startLogOutTimer = function () {
 const tick =  function() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
  labelTimer.textContent = `${min}:${sec}`;
  
  
    // when 0 second, stop timer and log out user 
  if(time === 0) {
  clearInterval(timer);
  labelWelcome.textContent = 'Connectez-vous pour commencer';
  
  containerApp.style.opacity = 0;
  
  }

  // Decrease 1s
  time--;
  
   };
  // set time to 5 minutes
 let time = 260;


  // call the time every second 
  tick();
 const timer = setInterval(tick, 1000);
 return timer 

}

// Event handler
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1,
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function(e) {
  // Prevent from submitting
  e.preventDefault()
  
currentAccount =  accounts.find(acc => acc.username === inputLoginUsername.value);
console.log(currentAccount);

if(currentAccount?.pin === Number(inputLoginPin.value)) {
  // Display UI and message
labelWelcome.textContent = `Bienvenue, ${currentAccount.owner.split(' ')[0]}`;

containerApp.style.opacity = 100;

// Create current day date and time
const now = new Date();
const options = {
  hour : 'numeric',
  minute : 'numeric', 
  day : 'numeric',
  month : 'long',
  year : 'numeric',
  weekday : 'long',

};

//const locale = navigator.language;

labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now)


// const day = `${now.getDate()}`.padStart(2,0);
// const month = `${now.getMonth() + 1}`.padStart(2,0);
// const year = now.getFullYear();
// const hour= `${now.getHours()}`.padStart(2,0);
// const min = `${now.getMinutes()}`.padStart(2,0);
//labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


// Clear input fields
inputLoginUsername.value = inputLoginPin.value = '';
inputLoginPin.blur();

// Timer
if(timer) clearInterval(timer);
timer = startLogOutTimer();

// Update UI
updateUI(currentAccount)

}

});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add Transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());


    // Update UI
      updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  };
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    setTimeout(function (){
    // Add movement
    currentAccount.movements.push(amount);

    // Add Loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer(); 
  }, 2500);
  }

  inputLoanAmount.value = '';
 
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

  }

  inputCloseUsername.value = inputClosePin.value = '';

});

let sorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['FCFA', 'Franc of the French Colonies of Africa'],
  ['EUR', 'Euro'],
  ['MAD', 'Moroccan dirham'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const cfaToMad = 0.017;

const movementsMad = movements.map(function(mov) {
  return mov * cfaToMad;
})
console.log(movements);
console.log(movementsMad);

const deposits = movements.filter(function(mov) {
  return mov > 0
});

console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(function(mov) {
  return mov < 0;
})

console.log(movements);
console.log(withdrawals);


const calcDaysPassed = (date1, date2) => 
Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));