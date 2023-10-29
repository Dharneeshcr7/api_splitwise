

const netBalances = new Map();
netBalances.set('user1', 20); // User 1 is owed 20
netBalances.set('user2', -120);  // User 2 owes 30
netBalances.set('user3', 100); 
netBalances.set('user4',0)// User 3 is owed 10
// Add more users and balances as needed

// Create an array to store the transactions
const transactions = [];

// Convert the Map keys to an array and sort the users by their net balances
const sortedUsers = Array.from(netBalances.keys()).sort((a, b) => netBalances.get(a) - netBalances.get(b));
console.log(sortedUsers,netBalances)
// Initialize two pointers for users who owe and are owed money
let oweIndex = 0;
let owedIndex = sortedUsers.length - 1;
var t=1;
while (oweIndex < owedIndex) {
  const oweUser = sortedUsers[oweIndex];
  const owedUser = sortedUsers[owedIndex];

  const oweAmount = -(netBalances.get(oweUser));
 
  const owedAmount = netBalances.get(owedUser);
  
  const amountToTransfer = Math.min(oweAmount, owedAmount);
  if(t<2){
    console.log(oweAmount,owedAmount,amountToTransfer)
    t++;
    }

  if (amountToTransfer > 0) {
    transactions.push({
      from: oweUser,
      to: owedUser,
      amount: amountToTransfer,
    });

    netBalances.set(oweUser, -(oweAmount - amountToTransfer));
    netBalances.set(owedUser, owedAmount - amountToTransfer);
  }

  if (netBalances.get(oweUser) == 0) {
    oweIndex++;
  }
  if (netBalances.get(owedUser) == 0) {
    owedIndex--;
  }
  
}

console.log('Optimal transactions:');
console.log(transactions);
