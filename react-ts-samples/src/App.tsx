import * as React from 'react';
import { HashRouter, Route, } from "react-router-dom";
import './App.css';

import CategoryChartSample from "./CategoryChartSample";
import Home from "./Home";
import Logo from './logo.svg';

class App extends React.Component {
    public render() {
        return (
            <HashRouter>
            <div>
                <div className="App-header">
                    <img src={Logo} className="App-logo" alt="Logo" />
                    <label className="App-title">REACT SAMPLES BROWSER</label>
                </div>

                <div className="content">
                        {/* <Route path="/" component={Home}/> */}
                        <Route exact={true} path="/" component={Home}/>
                        {/* <Route path="/stuff" component={Stuff}/> */}
                        <Route path="/CategoryCharts" component={CategoryChartSample}/>
                </div>
            </div>
        </HashRouter>
            // <div className="App">
            //     <header className="App-header">
            //         <img src={logo} className="App-logo" alt="logo" />
            //         <h1 className="App-title">Welcome to React</h1>
            //     </header>
            //     <p className="App-intro">
            //         To get started, edit <code>src/App.tsx</code> and save to reload.
            //     </p>
            // </div>
        );
    }
}

export default App;
