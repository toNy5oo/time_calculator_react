export const belongsToUser = (drinkID, userID) => drinkID === userID;

export const totalPerDrink = (drink, amount) => drink * amount;

export const findUserName = (userID, users) => {
	const [user] = users.filter((user) => user.id === userID);
	return user ? user?.title : "User";
};

export const userHasActiveDrinks = (userID, drinks) => {
	const drinksOfSingleUser = drinks.filter((drink) => drink.uid === userID);
	console.log(drinksOfSingleUser);
	return drinksOfSingleUser.length > 0 ? true : false;
};

export const isEverythingSelected = (userID, drinks) => {
	return drinks.filter((d) => d.uid === userID).every((d) => d.amount === 0);
};

//* Sums up the items into the cashout array
export const calculateCashOut = (itemsToCashout) =>
	itemsToCashout
		.reduce((acc, val) => acc + val.price * val.amount, 0)
		.toFixed(2);

export const computeDrinksTotalToPay = (drinks, userSelected) =>
	drinks
		.filter((d) => d.uid === userSelected)
		.reduce((acc, val) => acc + val.price * val.amount, 0);

export const selectAllDrinksToBePaid = (drinks, userID) => {
	const items = [];
	drinks.forEach((d) => {
		if (d.uid === userID) {
			const [exDrink] = drinks.filter((e) => e.key === d.key);
			items.push({ ...d, amount: exDrink.amount });
		}
	});
	return items;
};

export const setBackupArrayForTotalCashout = (drinks, userID) => {
	const backup = [];
	drinks.forEach((d) => {
		if (d.uid === userID) {
			backup.push({ ...d, amount: 0 });
		}
	});
	return backup;
};
