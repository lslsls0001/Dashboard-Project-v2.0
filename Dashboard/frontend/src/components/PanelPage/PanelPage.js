import React, { Component } from 'react';
import LotSelection from "../DisplayPage/LotSelection/LotSelection";
import "./PanelPage.css";

export default class PanelPage extends Component {
    render() {
        return (
            <div className="display">
                <LotSelection />
            </div>
        );
    }
}

