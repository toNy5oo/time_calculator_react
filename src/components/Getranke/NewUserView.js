import { Alert, Input, Row, Col, Space, Button } from 'antd'
import React from 'react'
import { Container } from 'react-bootstrap'
import DrinksButtons from './DrinksButtons'

const NewUserView = ({setIsAddUser, addUserToDB, setNewUser}) => {

    const handleChange = (event) => {
        setNewUser(event.target.value);
      };

    function handleKeyUp(event) {
        // Enter
        if (event.keyCode === 13) {
            addUserToDB()
        }
      }

  return (
    <Container>
        <Alert
            message={
            <>
            <Row justify='space-between'  className='align-items-center p-3'>
                <Col>Add new user</Col>
                <Col><Space><Input placeholder="Name" onKeyUp={handleKeyUp} onChange={handleChange}></Input><Button type='primary' onClick={addUserToDB}>Add</Button></Space></Col>
            </Row>
            </>
            }
            showIcon
            type="warning"
            closable
            onClose={() => setIsAddUser(false)}
        >
        </Alert>
    </Container>
  )
}

export default NewUserView