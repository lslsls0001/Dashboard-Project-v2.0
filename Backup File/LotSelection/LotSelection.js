import React, { Component } from 'react';
import Select, {components} from "react-select";
import Button from '@material-ui/core/Button';

import "./LotSelection.css";
import lotSelectionList from "./LotSelectionList.js";

const ValueContainer = ({ children, getValue, ...props }) => {
    let maxToShow = 1;
    var length = getValue().length;
    let displayChips = React.Children.toArray(children).slice(0, maxToShow);
    let shouldBadgeShow = length > maxToShow;
    let displayLength = length - maxToShow;
  
    return (
        <components.ValueContainer {...props}>
            {!props.selectProps.inputValue && displayChips}
            <div>
                {shouldBadgeShow &&`+ ${displayLength} item${length != 1 ? "s" : ""} selected`}
            </div>
        </components.ValueContainer>
    );
};

const customStyles = {
    control: (base) => ({
        ...base,
        borderColor: '#9e9e9e',
        fontSize:'12px',
        width: '220px',
        minHeight: '30px',
    }),
    menu: (base) => ({
        ...base,
        borderColor: '#9e9e9e',
        fontSize:'12px',
        width: '220px',
    }),
    input: (provided, state) => ({
        ...provided,
        margin: '0px',
    }),
    option:(base) =>({
        width: '220px',
        marginLeft: "5px",
    }),
    dropdownIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
    }),
    clearIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
    }),
    
};

export default class LotSelection extends Component {
    constructor(props){
        super(props);

        this.state = {
            technologyOptions: {value: "<All>", label: "<All>"},
            technologyOptionsList: lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name})),

            dataTypeOptions: {value: "<All>", label: "<All>"},
            mfgAreaOptions: {value: "<All>", label: "<All>"},
            processAreaOptions: {value: "<All>", label: "<All>"},
        }

        this.handleChangeTechnology = this.handleChangeTechnology.bind(this);
        this.handleChangeDataType = this.handleChangeDataType.bind(this);
        this.handleChangeMfgArea = this.handleChangeMfgArea.bind(this);
        this.handleChangeProcessArea = this.handleChangeProcessArea.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeTechnology(technologyOptions){
        this.setState({technologyOptions},()=>{
            console.log("update successfully")
        });
    }

    handleChangeDataType(dataTypeOptions){
        this.setState({dataTypeOptions},()=>{
            console.log("update successfully")
        });
    }

    handleChangeMfgArea(mfgAreaOptions){
        this.setState({mfgAreaOptions},()=>{
            console.log("update successfully")
        });
    }

    handleChangeProcessArea(processAreaOptions){
        this.setState({processAreaOptions},()=>{
            console.log("update successfully")
        });
    }

    handleOnClick(){
        this.setState({
            technologyOptionsList: lotSelectionList[1]['list'].map(e=>({value: e.name, label: e.name}))
        }, ()=>{return});
    }

    handleSubmit(event){
        event.preventDefault();
        console.log("submit")
    }

    render(){
        return(
            <div className="lot-selection">
                <h1>Lot Selection Component</h1>
                <form className="lot-selection-form" onSubmit={this.handleSubmit}>
                    <div 
                        className="lot-selection-form-technology-container"
                        onClick={this.handleOnClick}
                    >
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Technology:
                        </span>
                        <Select
                            className="lot-selection-form-technology-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.technologyOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="technologyList"
                            placeholder="None Selected"
                            onChange={this.handleChangeTechnology}
                            options={this.state.technologyOptionsList}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-data-type-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Date Type:
                        </span>
                        <Select
                            className="lot-selection-form-data-type-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.dataTypeOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="dataTypeList"
                            placeholder="None Selected"
                            onChange={this.handleChangeDataType}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-mfg-area-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Mfg Area:
                        </span>
                        <Select
                            className="lot-selection-form-mfg-area-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.mfgAreaOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="mfgAreaList"
                            placeholder="None Selected"
                            onChange={this.handleChangeMfgArea}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-process-area-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Process Area:
                        </span>
                        <Select
                            className="lot-selection-form-process-area-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.processAreaOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="processAreaList"
                            placeholder="None Selected"
                            onChange={this.handleChangeProcessArea}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-technology-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Technology:
                        </span>
                        <Select
                            className="lot-selection-form-technology-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.technologyOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="technologyList"
                            placeholder="None Selected"
                            onChange={this.handleChangeTechnology}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-Mfg-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Mfg area:
                        </span>
                        <Select
                            className="lot-selection-form-Mfg-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.technologyOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="mfgList"
                            placeholder="None Selected"
                            onChange={this.handleChangeTechnology}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-technology-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Technology:
                        </span>
                        <Select
                            className="lot-selection-form-technology-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.technologyOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="technologyList"
                            placeholder="None Selected"
                            onChange={this.handleChangeTechnology}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-Mfg-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Mfg area:
                        </span>
                        <Select
                            className="lot-selection-form-Mfg-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.technologyOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="mfgList"
                            placeholder="None Selected"
                            onChange={this.handleChangeTechnology}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-technology-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Technology:
                        </span>
                        <Select
                            className="lot-selection-form-technology-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.technologyOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="technologyList"
                            placeholder="None Selected"
                            onChange={this.handleChangeTechnology}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                    <div className="lot-selection-form-Mfg-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", marginLeft: "10px"}}>
                            Mfg area:
                        </span>
                        <Select
                            className="lot-selection-form-Mfg-select"
                            defaultValue={{value: "<All>", label: "<All>"}}
                            value={this.state.technologyOptions}
                            isMulti={true}
                            components={{ ValueContainer }}
                            isSearchable="true"
                            name="mfgList"
                            placeholder="None Selected"
                            onChange={this.handleChangeTechnology}
                            options={lotSelectionList[0]['list'].map(e=>({value: e.name, label: e.name}))}
                            styles={customStyles}
                        />
                    </div>
                </form>
            </div>
        );
    }
}
