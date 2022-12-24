
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import './App.css'
import Getranke from './components/Getranke/Getranke'
import Timer from './components/Timer/Timer'
import Reservierungen from './components/Reservierungen'
import BootNavbar from './components/BootNavbar'

function App() {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Suspense fallback={<div> Loading... </div>}>
                    {' '}
                    <BootNavbar />
                    <Content>
                        <Routes>
                            <Route path="/" element={<Timer />} />{' '}
                            <Route path="/getranke" element={<Getranke />} />{' '}
                            <Route
                                path="/reservierungen"
                                element={<Reservierungen />}
                            />{' '}
                        </Routes>{' '}
                    </Content>{' '}
                </Suspense>{' '}
            </Layout>{' '}
        </Router>
    )
}

export default App
