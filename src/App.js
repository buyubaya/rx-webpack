import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './assets/styles/index.scss';
import AdminPage from './pages/AdminPage';


class App extends React.Component {
    render(){
        return(
            <Router>
                <Switch>
                    <Route path='/' exact render={() => <h1>HELLO HOME</h1>} />
                    <Route path='/admin' exact component={AdminPage} />
                </Switch>
            </Router>
        )
    }
}


export default App;