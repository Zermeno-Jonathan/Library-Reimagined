import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
// import Test1 from './test1';

function App() {
    return (
        /*A fragment is a React component that allows you to group multiple 
        elements without adding an extra DOM node
        it is used by placing the code inside a pair of empty tags (<></>)
        the fragment works as a placeholder parent element*/

        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                {/* <Route path="/test1" element={<Test1 />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
