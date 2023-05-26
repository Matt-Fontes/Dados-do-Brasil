import './App.css';
import Tabs from './components/Tabs';
import IBGEStuff from './components/ibgeStuff';
import './App.css';
import { useState } from 'react';
import Imposto from './components/Imposto';
import MapaDeCalorSetores from './components/MapaDeCalorSetores';

function App() {

    const [active, setActive] = useState('pib');

    return (
        <div className="App">
            <Tabs onClick={key => setActive(key)} />
            {active === 'pib' && <IBGEStuff />}
            {active === 'impostos' && <Imposto />}
            {active === 'pib2' && <MapaDeCalorSetores />}
        </div>
    );
}

export default App;
