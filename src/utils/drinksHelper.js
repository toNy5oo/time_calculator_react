export const belongsToUser = (drinkID, userID) => drinkID === userID;

export const totalPerDrink = (drink, amount) => drink * amount;

export const findUserName = (userID, users) => {
	const [user] = users.filter((user) => user.id === userID);
	return user ? user?.title : "User";
};

export const userHasActiveDrinks = (userID, drinks) => {
	drinks.filter((drink) => drink.uid === userID)
}  