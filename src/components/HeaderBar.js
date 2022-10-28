import React from 'react'
import Logo from '../logo.png'
import { Image, Button, Space, Col, Row, PageHeader } from 'antd'
import { Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'
import { Container } from 'react-bootstrap'

function HeaderBar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Image
                        src={Logo}
                        preview={false}
                        alt={'BC Haunstetten Logo'}
                    />{' '}
                </Navbar.Brand>{' '}
                <Row>
                    <Col className="mx-3">
                        <Link to="/">
                            <Button type="primary" shape="round" size="large">
                                Timer{' '}
                            </Button>{' '}
                        </Link>{' '}
                    </Col>{' '}
                    <Col className="mx-3">
                        <Link to="/getranke">
                            <Button type="primary" shape="round" size="large">
                                Getränke{' '}
                            </Button>{' '}
                        </Link>{' '}
                    </Col>{' '}
                    <Col className="mx-3">
                        <Link to="/reservierungen">
                            <Button type="primary" shape="round" size="large">
                                Reservierungen{' '}
                            </Button>{' '}
                        </Link>{' '}
                    </Col>{' '}
                    {/* <Col className="mx-3">
                        <Link to="/thekendienst">
                            <Button type="primary" shape="round" size="large">
                                Thekendienst{' '}
                            </Button>{' '}
                        </Link>{' '}
                    </Col>{' '} */}
                </Row>{' '}
            </Container>{' '}
        </Navbar>
        //         <PageHeader
        //     className="site-page-header bg-dark"
        //     style={{
        //         display: 'flex',
        //         width: '100vw',
        //         justifyContent: 'center',
        //       }}
        //     onBack={() => null}
        //     backIcon={false}
        //     title={}
        //     extra={[

        //       ]}
        //   />
    )
}

export default HeaderBar

{
    /* <Image src={Logo} preview={false} alt={'BC Haunstetten Logo'} />


<Link to="/">
            <Button type="outline">Timer</Button>
        </Link>,
        <Link to="/getranke">
            <Button type="outline">Getränke</Button>
        </Link>,
        <Link to="/reservierungen">
            <Button type="outline">Reservierungen</Button>
        </Link>, */
}
