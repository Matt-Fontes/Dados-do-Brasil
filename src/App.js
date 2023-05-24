import './App.css';
import Tabs from './components/Tabs';
import IBGEStuff from './components/ibgeStuff';
import './App.css';
import { useState } from 'react';
import Imposto from './components/Imposto';

function App() {

    const [active, setActive] = useState('pib');

    return (
        <div className="App">
            <Tabs onClick={key => setActive(key)} />
            {active === 'pib' && <IBGEStuff />}
            {active === 'tba' && <Imposto />}
        </div>
    );
}

export default App;
