import { Alert, Input, Row, Col, Space, Button } from 'antd'
import React, {useEffect} from 'react'
import { Container } from 'react-bootstrap'

const NewUserView = ({setIsAddUser, addUserToDB, setNewUser, inputRef}) => {

  useEffect(() => {
    inputRef.current.focus()
  }, []);

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
      <Row justify="space-between" className="bg-light rounded my-3">
        <Col span={24}>
        <Alert
            className='rounded'
            message={
            <>
            <Row justify='space-between' className='align-items-center p-3'>
                <Col>Add new user</Col>
                <Col><Space><Input id='mitglieder__name' placeholder="Name" onKeyUp={handleKeyUp} onChange={handleChange} ref={inputRef}></Input><Button type='primary' onClick={addUserToDB}>Add</Button></Space></Col>
            </Row>
            </>
            }
            showIcon
            type="warning"
            closable
            onClose={() => setIsAddUser(false)}
        >
        </Alert>
        </Col>
        </Row>
    </Container>
  )
}

export default NewUserView