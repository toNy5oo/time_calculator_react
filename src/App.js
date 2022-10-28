import HeaderBar from './components/HeaderBar'
import Timer from './components/Timer'
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Getranke from './components/Getranke'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import './App.css'
import Thekendienst from './components/Thekendienst'
import Reservierungen from './components/Reservierungen'

function App() {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Suspense fallback={<div> Loading... </div>}>
                    {' '}
                    <HeaderBar />
                    <Content>
                        <Routes>
                            <Route path="/" element={<Timer />} />{' '}
                            <Route path="/getranke" element={<Getranke />} />{' '}
                            <Route
                                path="/reservierungen"
                                element={<Reservierungen />}
                            />{' '}
                            <Route
                                path="/thekendienst"
                                element={<Thekendienst />}
                            />{' '}
                        </Routes>{' '}
                    </Content>{' '}
                </Suspense>{' '}
            </Layout>{' '}
        </Router>
    )
}

export default App
