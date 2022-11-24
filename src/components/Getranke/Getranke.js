import React, { useEffect, useRef, useState } from "react";
import Localbase from "localbase";
import "../assets/css/buttons.css";
import autoAnimate from '@formkit/auto-animate'
import {
  Alert,
  Avatar,
  Button,
  Col,
  Dropdown,
  Empty,
  List,
  Menu,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Typography,
  Tag,
  InputNumber,
  notification,
  Affix,
  Tooltip,
} from "antd";
import {
  faBeerMugEmpty,
  faPizzaSlice,
  faGlassWater,
  faMartiniGlass,
  faPlus,
  faEuroSign,
} from "@fortawesome/free-solid-svg-icons";
import {
  QuestionCircleOutlined,
  PlusCircleFilled,
  CheckOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  EuroOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { DRINKS as drinklist } from "../assets/data/drinkList";
import DrinksButtons from "./DrinksButtons";
import { Container } from "react-bootstrap/";
import DrinkToAdd from "./DrinkToAdd";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewUserView from "./NewUserView";

function Getranke() {
  //Notification
  const showNotification = (title, msg) => {
    notification.open({
      message: title,
      description: msg,
    });
  };

  let db = new Localbase("db");
  //Comment to remove logger
  db.config.debug = false;
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [userSelected, setUserSelected] = useState(0);
  const [addToUser, setAddToUser] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [isAddUser, setIsAddUser] = useState(false);
  const [newUser, setNewUser] = useState("");
  const parent = useRef(null)
  let inputElement = useRef("");

  useEffect(() => {
    fetchDBDrinksData();
    fetchDBUsersData();
  }, []);

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  async function fetchDBUsersData() {
    try {
      let usersDB = await db.collection("users").get();
      setUsers(usersDB);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function fetchDBDrinksData() {
    try {
      let drinksDB = await db.collection("drinks").get();
      setDrinks(drinksDB);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const cashOutUser = (id) => {
    //Remove user record
    db.collection("users")
      .doc({ id: id })
      .delete()
      .then((response) => {
        setTimeout(() => setUsers(users.filter((d) => d.id !== id)), 200);
      })
      .catch((error) => {
        console.log("There was an error, do something else.");
      });

    //Remove drinks records
    db.collection("drinks")
      .doc({ uid: id })
      .delete()
      .then((response) => {
        setTimeout(() => setDrinks(drinks.filter((d) => d.uid !== id)), 200);
      })
      .catch((error) => {
        console.log("There was an error, do something else.");
      });

    showNotification(
      "User removed",
      "User has been removed from the active list"
    );
  };

  const setRowDetails = (key) => {
    console.log(key);
    setUserSelected(key);
    setIsAdd(true);
  };

  const resetRowDetails = () => {
    setIsAdd(false);
    setAddToUser([]);
    setUserSelected();
  };

  const calculatUserAmount = (userID) => {
    // get document by key
    let totalAmount = 0;
    drinks.forEach((element) => {
      if (element.uid === userID) totalAmount += element.price * element.amount;
    });
    return totalAmount.toFixed(2);
  };

  /**
   *
   * @param {Array} drinks
   * @returns String - Amount to be paid
   */
  const calculateAmountToPay = (drinks) => {
    let amountToPay = 0;
    drinks.map((e) => (amountToPay += e.amount * e.price));
    return amountToPay.toFixed(2) + " €";
  };

  /**
   *   Add the temporary array of selected drinks with a current userSelected to the drinks array mirroring the db
   */
  async function addDrinksToUser() {
    //Create temp array with drinks from selectedUser
    let existingDrinks = drinks.filter((drink) => drink.uid === userSelected);

    addToUser.forEach(async (drinkToAdd) => {
      let currentDrink = existingDrinks.filter(
        (el) => drinkToAdd.key === el.key
      );

      if (currentDrink.length === 0) {
        //Create a new record
        await db
          .collection("drinks")
          .add(drinkToAdd)
          .then((response) => {})
          .catch((error) => {
            console.log("There was an error, do something else.");
          });
      } else {
        //fetch the drink that we are working on
        //update the amount
        currentDrink[0].amount += drinkToAdd.amount;
        //update the doc on the db
        await db
          .collection("drinks")
          .doc({ uid: userSelected, key: drinkToAdd.key })
          .update({ amount: currentDrink[0].amount });
      }
      //Updates values in APP with DB data
      fetchDBDrinksData();
      //Set list of drinks to add to []
      setAddToUser([]);
      //Reset userSelected
      resetRowDetails();
    });
    showNotification(
      "Drinks added",
      "Drinks have been added to the list of the drink for " +
        users.filter((u) => u.id === userSelected)[0].title
    );
  }

  /**
   * Returns each single drink record as Tag
   */
  const drinksDescriptions = (id) => {
    return drinks.filter(d => d.uid === id).length != 0 
    ?( drinks.map((d) => {
      if (d.uid === id) {
        return <Tag color="blue">{d.amount + " " + d.label}</Tag>;
      }
    }))
    : "No"
  };

  const addUser = () => {
    setIsAddUser(true);
  };

  const addUserToDB = () => {
    if (!nameAlreadyExists()) {
      if (newUser !== "") {
        const uniqueID = Math.floor(Math.random() * Date.now());
        db.collection("users")
          .add({
            id: uniqueID,
            title: newUser,
            toPay: 0,
          })
          .then((response) => {
            setTimeout(() => {
              fetchDBUsersData();
              setIsAddUser(false);
              setNewUser("");
            }, 250);
          })
          .catch((error) => {
            console.log("There was an error, do something else.");
          });
      } else
        showNotification(
          "No name entered",
          "Please provide a name for the new mitglieder"
        );
    }
    else showNotification('User already present', 'There is already a user with the name '+newUser)
  };

  function nameAlreadyExists() {
    return users.some((e) =>
      e.title.toUpperCase() === newUser.toUpperCase())
  }

  //View for the alert
  const alertMessage = () => {
    return (
      <>
        <Col>Adding to{" "}
        {<strong>{users.filter((u) => u.id === userSelected)[0].title}</strong>}</Col>
      </>
    );
  };

 //View for the alert
 const alertDescription = () => {
  return (
    <>
      {addToUser.map((e) => (
        <DrinkToAdd
          drinkName={e.label}
          addToUser={addToUser}
          setAddToUser={setAddToUser}
          drinkId={e.key}
          calculateAmountToPay={calculateAmountToPay}
        />
      ))}
    </>
  );
};

  return (
    <>
      {!isAddUser ? (
        <Header
          users={users}
          setFilteredUsers={setFilteredUsers}
          addUser={addUser}
          inputElement={inputElement}
        />
      ) : (
        <NewUserView
          setIsAddUser={setIsAddUser}
          addUserToDB={addUserToDB}
          setNewUser={setNewUser}
        />
      )}
      {addToUser.length !== 0 && (
        <Container fluid>
          <Row>
            <Col span={20} className="mx-auto mb-4">
              <Affix offsetTop={20} >
                <Alert
                  message={alertMessage()}
                  description={alertDescription()}
                  type={"info"}
                  showIcon
                  action={
                    <>
                      {" "}
                      <Space>
                        {<div className="fs-6 fw-bold">{calculateAmountToPay(addToUser)}</div>}{" "}
                        {calculateAmountToPay(addToUser) !== 0 && (
                          <Button onClick={addDrinksToUser} type='primary'>
                            <CheckOutlined />
                          </Button>
                        )}
                      </Space>
                    </>
                  }
                ></Alert>
              </Affix>
            </Col>
          </Row>
        </Container>
      )}
      {/* List */}
      <Container ref={parent}>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={filteredUsers.length !== 0 ? filteredUsers : users}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="bg-light p-4 rounded"
              actions={[
                isAdd && userSelected === item.id ? (
                  <DrinksButtons
                    resetRowDetails={resetRowDetails}
                    setAddToUser={setAddToUser}
                    addToUser={addToUser}
                    addDrinksToUser={addDrinksToUser}
                    userSelected={userSelected}
                    showNotification={showNotification}
                  />
                ) : (
                  <>
                    <Button
                      shape="circle"
                      className="addBtn mx-2"
                      onClick={() => setRowDetails(item.id)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Popconfirm
                      placement="left"
                      title={"Are you sure"}
                      onConfirm={() => cashOutUser(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title={`Cash Out ${item.title}`}>
                        <Button className="cashOutBtn" shape="circle">
                          {/* <Button className="cashOutBtn">*/}
                          <FontAwesomeIcon icon={faEuroSign} />
                        </Button>
                      </Tooltip>
                    </Popconfirm>
                  </>
                ),
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  ref={parent}
                  avatar={
                    <UserOutlined
                      style={{
                        fontSize: "25px",
                        marginTop: "10px",
                        padding: "5px",
                      }}
                    />
                  }
                  title={<div className="fs-6">{item.title}</div>}
                  description={drinksDescriptions(item.id)}
                />
                {item.id !== userSelected && (
                  <Tag color="red" className="fs-6 p-2">
                    {calculatUserAmount(item.id)} €
                  </Tag>
                )}
              </Skeleton>
            </List.Item>
          )}
        />
      </Container>
    </>
  );
}
// return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
export default Getranke;
