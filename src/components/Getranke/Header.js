import React, { useState, useEffect, useRef } from "react";
import { AutoComplete, Button, Col, Input, Row, Space } from "antd";
import { Container } from "react-bootstrap";
import {
  PlusOutlined, SearchOutlined
} from "@ant-design/icons";

const Header = ({ users, setFilteredUsers, addUser, inputElement }) => {
  const { Search } = AutoComplete;
  const [searchText, setSearchText] = useState("");
 

  useEffect(() => {
    return () => {};
  }, [searchText]);

  //Filtered search bar
  const handleChange = (e) => {
    setFilteredUsers(
      users.filter((el) =>
        el.title.toUpperCase().includes(e.target.value.toUpperCase())
      )
    );
  };

  return (
    <>
      <Container>
        <Row justify="space-between" className="bg-light rounded my-3">
          <Col className="m-4">
            <Space>
              {/* <div>Suchen</div> */}
              <Input
                prefix={<SearchOutlined />}
                className='input'
                allowClear={true}
                onChange={handleChange}
                placeholder="Mitglieder suchen"
              ></Input>
            </Space>
          </Col>
          <Col className="m-4">
            <Button type='primary' icon={<PlusOutlined/>} onClick={addUser}>
              {" "}
              Mitglieder hinzufügen
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Header;
