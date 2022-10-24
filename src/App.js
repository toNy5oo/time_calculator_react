import HeaderBar from './components/HeaderBar'
import Timer from './components/Timer'
import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Getranke from './components/Getranke'
import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import './App.css'

function App() {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <HeaderBar />
                    <Content>
                        <Routes>
                            <Route path="/" element={<Timer />} />
                            <Route path="/getranke" element={<Getranke />} />
                        </Routes>
                    </Content>
                </Suspense>
            </Layout>
        </Router>
    )
}

export default App
