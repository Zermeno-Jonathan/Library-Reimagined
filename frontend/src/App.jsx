// import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Pages
import Home from './pages/Home/Home';
import Books from './pages/Books/Books';
import Loans from './pages/Loans/Loans';
import Login from './pages/Login/Login';
import MenuAdmin from './pages/MenuAdmin/MenuAdmin';
import MenuUser from './pages/MenuUser/MenuUser';
import Queries from './pages/Queries/Queries';
import Users from './pages/Users/Users';
// import Test1 from './test1';

function App() {
    return (
        /*A fragment is a React component that allows you to group multiple 
        elements without adding an extra DOM node
        it is used by placing the code inside a pair of empty tags (<></>)
        the fragment works as a placeholder parent element*/

        <BrowserRouter>
            <Routes>
                {/* Pages */}
                <Route path="/Home" element={<Home />} />
                <Route path="/Books" element={<Books />} />
                <Route path="/Loans" element={<Loans />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/MenuAdmin" element={<MenuAdmin />} />
                <Route path="/MenuUser" element={<MenuUser />} />
                <Route path="/Queries" element={<Queries />} />
                <Route path="/Users" element={<Users />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
