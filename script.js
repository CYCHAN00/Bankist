'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
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

const displayMovements = function (movements, sort = false) {
  //Emty the container
  containerMovements.innerHTML = '';
  console.log(movements, sort);
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  console.log(movs);
  // loop the array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} €</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const clacDisplayPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((arr, mov) => arr + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(index => index.slice(0, 1))
      .join('');
  });
};

const updateUI = function (acc) {
  //Display movement
  displayMovements(acc.movements);

  //Display summmary
  calcDisplaySummary(acc);

  //Display balance
  clacDisplayPrintBalance(acc);
};

createUsernames(accounts);

const calcDisplaySummary = function (acc) {
  //Cal incomes
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((arr, mov) => (arr += mov), 0);
  labelSumIn.textContent = `${incomes} €`;
  //Cal out
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((arr, mov) => (arr += mov));
  labelSumOut.textContent = `${Math.abs(out)} €`;
  //Cal interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(ins => ins >= 1)
    .reduce((arr, ins) => (arr += ins), 0);
  labelSumInterest.textContent = `${Math.abs(interest)} €`;
};

//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    //Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
  }
  // console.log(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // inputLoanAmount.value = '';
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;

    labelWelcome.textContent = `Login in to get started`;
  }
  inputCloseUsername.value = inputLoginPin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('click');
  console.log(currentAccount.movements);
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const withdrawal = movements.filter(mov => mov < 0);
// console.log(withdrawal);

/////////////////////////////////////////////////

// movements.forEach(function (a, b, c) {
//   console.log(a, b, c);
// });

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];
// // console.log(dogsJulia.slice(1));

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogs = [...dogsJulia.slice(1, -2), ...dogsKate];
//   console.log(dogs);
//   dogs.forEach(function (age, i) {
//     const type = age >= 3 ? 'adult' : 'puppy🐶';
//     console.log(`Dog number ${i + 1} is an ${type}, and is ${age} years old`);
//   });
// };
// checkDogs(dogsJulia, dogsKate);

// const calcAverage = function (ages) {
//   const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + 4 * age));
//   console.log(humanAge);
//   const mathcAge = humanAge.filter(age => age >= 18);
//   console.log(mathcAge);
//   const averageAge =
//     mathcAge.reduce((arr, age) => (arr += age), 0) / mathcAge.length;
//   console.log(averageAge);
// };

// const calcAverage = function (ages) {
//   const humanAge = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + 4 * age))
//     .filter(age => age >= 18)
//     .reduce((crr, age, i, arr) => (crr += age / arr.length), 0);

//   console.log(humanAge);
// };

// calcAverage([5, 2, 4, 1, 15, 8, 3]);
// calcAverage([16, 6, 10, 5, 6, 1, 4]);

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(function (dog, i) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

dogs.find(dog => {
  if (dog.owners.includes('Sarah')) {
    console.log(dog);
    dog.curFood > dog.recommendedFood
      ? console.log(`Sarah's dog is eating to much`)
      : console.log(`Sarah's dog is eating too little`);
  }
});

// const { ownersEatTooMuch, ownersEatTooLittle } = dogs.includes(
//   (sums, currdog) => {
//     currdog.curFood > currdog.recommendedFood
//       ? sums.ownersEatTooMuch.push(currdog.owners)
//       : sums.ownersEatTooLittle.push(currdog.owners);
//   },
//   { ownersEatTooMuch: [''], ownersEatTooLittle: [''] }
// );

// console.log(ownersEatTooLittle, ownersEatTooMuch);

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();
console.log(`${ownersEatTooMuch.join(' and ')} eat too munch`);
console.log(`${ownersEatTooLittle.join(' and ')} eat too little`);

console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);
// const okayDog = Array.from(  dogs.some(
//   dog =>
//     dog.curFood > dog.recommendedFood * 0.9 &&
//     dog.curFood < dog.recommendedFood * 1.1
// ) )

dogs.sort((a, b) => (a.recommendedFood > b.recommendedFood ? 1 : -1));
console.log(dogs);
