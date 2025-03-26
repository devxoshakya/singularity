/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
// import MAC from './hooks/MacComp'
import { Dashboard } from './pages/dashboard'
// import ResultExtraction from './pages/ResultExtraction'
// import { Records } from './pages/Records'
import Home from './pages/Home'

function App(): JSX.Element {


  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    
  )
}

export default App
