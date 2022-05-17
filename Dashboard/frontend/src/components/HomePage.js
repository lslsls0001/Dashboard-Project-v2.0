import React, {Component} from "react";
import PanelPage from "./PanelPage/PanelPage";
import DisplayPage from "./DisplayPage/DisplayPage";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

{/* 
    This one has a router to dispatch the components with specific url, easy to jump among pages.
*/}

export default class HomePage extends Component{
    constructor(props){
       super(props);
    }

    render(){
        return(
            <Router>
                <Switch> 
                    <Route exact path="/frontend/" >
                        <h1>This is the home page</h1>
                    </Route>
                    <Route path="/frontend/panel" component={PanelPage} />
                    <Route path="/frontend/display" component={DisplayPage} />

                    <Redirect to="/frontend/" />
                </Switch>
            </Router>
        );
    }
}
