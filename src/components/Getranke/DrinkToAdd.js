import React from 'react'
import { InputNumber, Tag, Button } from 'antd'
import { calculateNewValue } from '@testing-library/user-event/dist/utils';

const DrinkToAdd = ({drinkName, drinkId, setAddToUser, addToUser, calculateAmountToPay}) => {
    
    const changeHandler = drinkId => inputValue => {
        console.log(drinkId, inputValue)
        const newState = addToUser.map(obj => {
            if (obj.key === drinkId) {
              //Return object modified
              return {...obj, amount: inputValue};
            }
            //Return same obj
            return obj;
          });
          
          //Set state
          setAddToUser(newState);
          calculateAmountToPay(addToUser)
     };
   
     //Remove item from the list of drinks to add
    const onDelete = (id) => {
        setAddToUser(prevState => prevState.filter((d) => d.key !== id))
      };

  return (
  <>
  <InputNumber 
            style={{width: '220px', textAlign: 'center', margin: '0 10px'}} 
            addonBefore={drinkName} 
            addonAfter={<a onClick={() => onDelete(drinkId)}>X</a>} 
            min={1} 
            defaultValue={1} 
            onChange={changeHandler(drinkId)}
            />
  </>
  
  )
}

export default DrinkToAdd