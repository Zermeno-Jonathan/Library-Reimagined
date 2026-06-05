import './App.css';

function App() {
    return (
        /*A fragment is a React component that allows you to group multiple 
        elements without adding an extra DOM node
        it is used by placing the code inside a pair of empty tags (<></>)
        the fragment works as a placeholder parent element*/
        <>
            <div>
                <h2>Hello World, Hello React</h2>
                <p>
                    Found in <i>frontend/src/App.jsx</i>
                </p>
            </div>
        </>
    );
}

export default App;
