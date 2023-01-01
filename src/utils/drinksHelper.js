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
