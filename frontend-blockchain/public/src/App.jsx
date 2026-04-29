import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";

function App() {

  return (
    <Router>
      <div className="App">
        <div style={{padding:0}} className="content">
          <Routes>
            <Route path='/' element={ <Home /> } />
            {/*<Route path='/Register' element={<Register></Register>}/>*/}
            <Route path='/Login' element={<Login></Login>}/>
            <Route path='/Home' element={<Home></Home>}/>
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
