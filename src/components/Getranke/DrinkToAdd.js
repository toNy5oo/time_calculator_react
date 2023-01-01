import React from "react";
import { Button, InputNumber, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const DrinkToAdd = ({
	drinkName,
	drinkId,
	setAddToUser,
	addToUser,
	calculateAmountToPay,
}) => {
	const changeHandler = (drinkId) => (inputValue) => {
		console.log(drinkId, inputValue);
		const newState = addToUser.map((obj) => {
			if (obj.key === drinkId) {
				//Return object modified
				return { ...obj, amount: inputValue };
			}
			//Return same obj
			return obj;
		});

		//Set state
		setAddToUser(newState);
		calculateAmountToPay(addToUser);
	};

	//Remove item from the list of drinks to add
	const onDelete = (id) => {
		setAddToUser((prevState) => prevState.filter((d) => d.key !== id));
	};

	return (
		<div className="mx-1">
			<Button danger onClick={() => onDelete(drinkId)}>
				<Space>
					<FontAwesomeIcon icon={faXmark} />
					<span>{drinkName}</span>
				</Space>
			</Button>
			<InputNumber
				className="text-center"
				style={{width: "48px"}}
				min={1}
				defaultValue={1}
				onChange={changeHandler(drinkId)}
			/>
		</div>
	);
};

export default DrinkToAdd;
