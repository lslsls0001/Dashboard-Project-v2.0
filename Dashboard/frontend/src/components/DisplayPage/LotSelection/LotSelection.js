import React, { Component } from 'react';
import Select, {components} from "react-select";

import Button from '@material-ui/core/Button';
import DualListBox from 'react-dual-listbox';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import "./LotSelection.css";
import lotSelectionList from "./LotSelectionList.js";
import typeList from './LotSelectionTypeList.js';

import axios from 'axios';
import qs from 'qs';

const customStyles = {
    control: (base) => ({
        ...base,
        fontSize:'15px',/Users/Yibo/Aspen Technology/Auto-healing/scripts/Solution to find Robust Locator for Selector
        width: '300px',
        minHeight: '35px',
    }),
    menu: (base) => ({
        ...base,
        fontSize:'15px',
        width: '300px',
    }),
    input: (provided, state) => ({
        ...provided,
        margin: '0px',
    }),
    option:(base) =>({
        width: '300px',
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
            technologySelectedValue: [],                //in submit
            technologyOptions: [],
            technologySelectedValueDisplay: [],

            dataTypeSelectedValue: [],                  //in submit
            dataTypeOptions: [],
            dataTypeSelectedValueDisplay: [],

            mfgAreaSelectedValue: [],                   //in submit
            mfgAreaOptions: [],
            mfgAreaSelectedValueDisplay: [],

            productFamilySelectedValue: [],             //in submit
            productFamilyOptions: [],
            productFamilySelectedValueDisplay: [],

            productSelectedValue: [],                   //in submit
            productOptions: [],
            productSelectedValueDisplay: [],

            lotTypeSelectedValue: [],                   //in submit
            lotTypeOptions: [],
            lotTypeSelectedValueDisplay: [],

            projectSelectedValue: [],                   //in submit
            projectOptions: [],
            projectSelectedValueDisplay: [],

            mcnSelectedValue: [],                       //in submit
            mcnOptions: [],
            mcnSelectedValueDisplay: [],
 
            partIdMaskSetSelectedValue: [],             //in submit
            partIdMaskSetOptions: [],
            partIdMaskSetSelectedValueDisplay: [],

            partIdSelectedValue: [],                    //in submit
            partIdOptions: [],
            partIdSelectedValueDisplay: [],

            processAreaSelectedValue: [],               //in submit
            processAreaOptions: [],
            processAreaSelectedValueDisplay: [],

            operationSelectedValue: [],                 //in submit
            operationOptions: [],
            operationSelectedValueDisplay: [],

            subOperationSelectedValue: [],              //in submit
            subOperationOptions: [],
            subOperationSelectedValueDisplay: [],

            equipmentSelectedValue: [],                 //in submit
            equipmentOptions: [],
            equipmentSelectedValueDisplay: [],



            calendarOption: 'Date',                     // in submit, 'Date', 'Last n Days/Lots', 'Calendar Rule'
            calendarOptionDate: {                       // in submit
                startDate: [],                          // [year, month, day]           -       2021, 10, 25 for October 25th, 2021
                startTime: [],                          // [hours, minutes, seconds]    -       9, 7 for 9:07 am    14, 36 for 2:36 pm
                endDate: [],                             
                endTime: []
            },
            calendarOptionLastNDaysLots: {              // in submit
                radioButton: 'Last Days',               // 'Last Days' or 'Last Lots' - make sure initial value corresponds to defaultChecked radio button
                lastDaysTotal: 1,                       // if radioButton == 'Last Days'
                lastLotsTotal: 1                        // if radioButton == 'Last Lots'
            },
            calendarOptionCalendarRule: {               // in submit
                radioButton: 'Period',                  // 'Period' or 'Last' - make sure initial value corresponds to defaultChecked radio button

                // if radioButton == 'Period'
                periodTimeFormat: 'Hours',              // 'Hours', 'Days', 'Weeks'
                periodTimeStart: 1,                     // time start for hours, days, or weeks
                periodTimeEnd: 1,                       // time end for hours, days, or weeks

                // if radioButton == 'Last'
                lastTimeFormat: 'Hours',                // 'Hours', 'Days', 'Weeks'
                lastTotal: 1                            // total amount of hours, days, or weeks
            },


            lotIdContainerSelectedValue: [],            //in submit
            lotIdContainerOptions: [],
            /*
            lotIdContainerOptions: [
				{value: "D00003439", label: "D00003439"},             //module_id = 4
				{value: "DESW09580", label: "DESW09580"},             //module_id = 5
				{value: "DEMSW9479", label: "DEMSW9479"},             //module_id = 6
				{value: "DEMSW7782", label: "DEMSW7782"},             //module_id = 7
				{value: "1481125", label: "1481125"},                //module_id = 1
			],
            */

            dataTypeListDisplay: {},

            dataRetrievalAggregationLevel: 'Lot',                   //in submit, Radio Button: 'Lot', 'Wafer', 'Unit' - make sure initial value corresponds to defaultChecked radio button
            dataRetrievalAggregationLevelExtra: false,              // Checkbox: true = checked, false = not checked
            dataRetrievalRetrieveParameterBy: 'Lot',               //in submit, Radio Button: 'None', 'Product', 'Lot' - make sure initial value corresponds to defaultChecked radio button
            dataRetrievalTypes: [],                                 //in submit, Checkboxes: 'WIP', 'Metrology', 'Defect', 'PCM', 'Bin', 'WP', 'FT', 'FDC'
            dataRetrievalTypeClicked: '',                           //only one element in this array, it stores which data type the user clicked.
            
            dataRetrievalWPOperationMenuList: [],                   // WP 
            dataRetrievalWPOperationMenuListSelectedValue: 'All',   //in submit

            dataRetrievalPCMOperationMenuList: [],                   // PCM
            dataRetrievalPCMOperationMenuListSelectedValue: 'All',   //in submit

            dataRetrievalWIPOperationMenuList: [],                   // WIP
            dataRetrievalUseSubOperations: false,                   //in submit, click to see whether to use Sub operation with the operations
            
            parameterContainerOptions: [], 
            parameterContainerWIPSelectedValue: [],                    //in submit
            parameterContainerWPSelectedValue: [],                    //in submit
            parameterContainerPCMSelectedValue: [],                    //in submit         

            /* 
            parameterContainerOptions: [
				{value: "parameter_1", label: "parameter_1"},
				{value: "parameter_2", label: "parameter_2"},
				{value: "parameter_3", label: "parameter_3"},
				{value: "parameter_4", label: "parameter_4"},
				{value: "parameter_5", label: "parameter_5"},
				{value: "parameter_6", label: "parameter_6"},
                {value: "parameter_7", label: "parameter_7"},
                {value: "parameter_8", label: "parameter_8"},
                {value: "parameter_9", label: "parameter_9"},
                {value: "parameter_10", label: "parameter_10"},
			],
            */

        }

        this.handleChangeTechnology = this.handleChangeTechnology.bind(this);
        this.handleChangeDataType = this.handleChangeDataType.bind(this);
        this.handleChangeMfgArea = this.handleChangeMfgArea.bind(this);
        this.handleChangeProductFamily = this.handleChangeProductFamily.bind(this);
        this.handleChangeProduct = this.handleChangeProduct.bind(this);
        this.handleChangeLotType = this.handleChangeLotType.bind(this);
        this.handleChangeProject = this.handleChangeProject.bind(this);
        this.handleChangeMCN = this.handleChangeMCN.bind(this);
        this.handleChangePartIdMaskSet = this.handleChangePartIdMaskSet.bind(this);
        this.handleChangePartId = this.handleChangePartId.bind(this);
        this.handleChangeProcessArea = this.handleChangeProcessArea.bind(this);
        this.handleChangeOperation = this.handleChangeOperation.bind(this);
        this.handleChangeSubOperation = this.handleChangeSubOperation.bind(this);
        this.handleChangeEquipment = this.handleChangeEquipment.bind(this);

        this.sendRequestForSelectionDropDown = this.sendRequestForSelectionDropDown.bind(this);

        this.handleTechnologyDropDown = this.handleTechnologyDropDown.bind(this);
        this.handleDataTypeDropDown = this.handleDataTypeDropDown.bind(this);
        this.handleMfgAreaDropDown = this.handleMfgAreaDropDown.bind(this);
        this.handleProductFamilyDropDown = this.handleProductFamilyDropDown.bind(this);
        this.handleProductDropDown = this.handleProductDropDown.bind(this);
        this.handleLotTypeDropDown = this.handleLotTypeDropDown.bind(this);
        this.handleProjectDropDown = this.handleProjectDropDown.bind(this);
        this.handleMCNDropDown = this.handleMCNDropDown.bind(this);
        this.handlePartIdMaskSetDropDown = this.handlePartIdMaskSetDropDown.bind(this);
        this.handlePartIdDropDown = this.handlePartIdDropDown.bind(this);
        this.handleProcessAreaDropDown = this.handleProcessAreaDropDown.bind(this);
        this.handleOperationDropDown = this.handleOperationDropDown.bind(this);
        this.handleSubOperationDropDown = this.handleSubOperationDropDown.bind(this);
        this.handleEquipmentDropDown = this.handleEquipmentDropDown.bind(this);


        
        // Choose 1 of 3 calendar options
        this.handleClickCalendarOptionsDate = this.handleClickCalendarOptionsDate.bind(this);

        // Date
        this.handleChangeDateStartDate = this.handleChangeDateStartDate.bind(this);
        this.handleChangeDateStartTime = this.handleChangeDateStartTime.bind(this);
        this.handleChangeDateEndDate = this.handleChangeDateEndDate.bind(this);
        this.handleChangeDateEndTime = this.handleChangeDateEndTime.bind(this);

        // Last n Days/Lots
        this.handleClickCalendarOptionsLastNDaysLots = this.handleClickCalendarOptionsLastNDaysLots.bind(this);
        this.handleClickLastNDaysLotsLastDaysRadioButton = this.handleClickLastNDaysLotsLastDaysRadioButton.bind(this);
        this.handleClickLastNDaysLotsLastLotsRadioButton = this.handleClickLastNDaysLotsLastLotsRadioButton.bind(this);
        this.handleChangeLastNDaysLotsLastDaysTotal = this.handleChangeLastNDaysLotsLastDaysTotal.bind(this);
        this.handleChangeLastNDaysLotsLastLotsTotal = this.handleChangeLastNDaysLotsLastLotsTotal.bind(this);

        // Calendar Rule
        this.handleClickCalendarOptionsCalendarRule = this.handleClickCalendarOptionsCalendarRule.bind(this);
        this.handleClickCalendarRulePeriodRadioButton = this.handleClickCalendarRulePeriodRadioButton.bind(this);
        this.handleClickCalendarRuleLastRadioButton = this.handleClickCalendarRuleLastRadioButton.bind(this);
        this.handleChangeCalendarRulePeriodTimeFormat = this.handleChangeCalendarRulePeriodTimeFormat.bind(this);
        this.handleChangeCalendarRulePeriodTimeStart = this.handleChangeCalendarRulePeriodTimeStart.bind(this);
        this.handleChangeCalendarRulePeriodTimeEnd = this.handleChangeCalendarRulePeriodTimeEnd.bind(this);
        this.handleChangeCalendarRuleLastTotal = this.handleChangeCalendarRuleLastTotal.bind(this);
        this.handleChangeCalendarRuleLastTimeFormat = this.handleChangeCalendarRuleLastTimeFormat.bind(this);

        // Data Retrieval
        this.sendRequestForDataTypeList = this.sendRequestForDataTypeList.bind(this);
        // Aggregation Level
        this.handleClickAggregationLevelLotRadioButton = this.handleClickAggregationLevelLotRadioButton.bind(this);
        this.handleClickAggregationLevelWaferRadioButton = this.handleClickAggregationLevelWaferRadioButton.bind(this); 
        this.handleClickAggregationLevelUnitRadioButton = this.handleClickAggregationLevelUnitRadioButton.bind(this);
        this.handleClickAggregationLevelExtraCheckBox = this.handleClickAggregationLevelExtraCheckBox.bind(this);
        // Retrieve Parameter By
        this.handleClickRetrieveParameterByNoneRadioButton = this.handleClickRetrieveParameterByNoneRadioButton.bind(this);
        this.handleClickRetrieveParameterByProductRadioButton =  this.handleClickRetrieveParameterByProductRadioButton.bind(this);
        this.handleClickRetrieveParameterByLotRadioButton = this.handleClickRetrieveParameterByLotRadioButton.bind(this);
        this.handleClickDataTypeCheckBox = this.handleClickDataTypeCheckBox.bind(this);
        this.sendRequestForDataTypeOpertionMenuList = this.sendRequestForDataTypeOpertionMenuList.bind(this);


        this.sendRequestGetLotId = this.sendRequestGetLotId.bind(this);
        this.handleClickGetLotId = this.handleClickGetLotId.bind(this);


        this.handleChangeLotIdContainer = this.handleChangeLotIdContainer.bind(this);
        this.handleChangeWIPParameterContainer = this.handleChangeWIPParameterContainer.bind(this);
        this.handleChangeWPParameterContainer = this.handleChangeWPParameterContainer.bind(this);
        this.handleChangePCMParameterContainer = this.handleChangePCMParameterContainer.bind(this);


        this.sendRequestForJsonForm = this.sendRequestForJsonForm.bind(this);
        this.handleClickSubmitAllParameters = this.handleClickSubmitAllParameters.bind(this);

        this.initStateGroup_1 = this.initStateGroup_1.bind(this);
        this.initStateGroup_2 = this.initStateGroup_2.bind(this);
    }

    initStateGroup_1(paramArray){
        this.setState({
            productFamilySelectedValue: paramArray[0],
            productFamilySelectedValueDisplay: paramArray[1],

            productSelectedValue: paramArray[2],
            productSelectedValueDisplay: paramArray[3],

            lotTypeSelectedValue: paramArray[4],
            lotTypeSelectedValueDisplay: paramArray[5],

            projectSelectedValue: paramArray[6],
            projectSelectedValueDisplay: paramArray[7],

            mcnSelectedValue: paramArray[8],
            mcnSelectedValueDisplay: paramArray[9],
 
            partIdMaskSetSelectedValue: paramArray[10],
            partIdMaskSetSelectedValueDisplay: paramArray[11],

            partIdSelectedValue: paramArray[12],
            partIdSelectedValueDisplay: paramArray[13],
        },()=>{return})
    }

    initStateGroup_2(paramArray){
        this.setState({
            processAreaSelectedValue: paramArray[0],
            processAreaSelectedValueDisplay: paramArray[1],

            operationSelectedValue: paramArray[2],
            operationSelectedValueDisplay: paramArray[3],

            subOperationSelectedValue: paramArray[4],
            subOperationSelectedValueDisplay: paramArray[5],

            equipmentSelectedValue: paramArray[6],
            equipmentSelectedValueDisplay: paramArray[7],
        },()=>{return})
    }

    handleChangeTechnology(technologySelectedValue){
        console.log(technologySelectedValue)
        
        this.setState({
            technologySelectedValue
        },()=>{
            var technologySelectedValueDisplayList = []
            for (let i = 0; i < this.state.technologySelectedValue.length; ++i){
                technologySelectedValueDisplayList.push(technologySelectedValue[i].value + " ")
            }
            this.setState({
                technologySelectedValueDisplay:technologySelectedValueDisplayList,
            },()=>{
                var paramArray_1 = []
                for(let i=0; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeDataType(dataTypeSelectedValue){
        console.log(dataTypeSelectedValue)
        
        this.setState({
            dataTypeSelectedValue
        },()=>{
            var dataTypeSelectedValueDisplayList = []
            for (let i = 0; i < this.state.dataTypeSelectedValue.length; ++i){
                dataTypeSelectedValueDisplayList.push(dataTypeSelectedValue[i].value + " ")
            }
            this.setState({
                dataTypeSelectedValueDisplay:dataTypeSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                for(let i=0; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeMfgArea(mfgAreaSelectedValue){
        console.log(mfgAreaSelectedValue)
        
        this.setState({
            mfgAreaSelectedValue
        },()=>{
            var mfgAreaSelectedValueDisplayList = []
            for (let i = 0; i < this.state.mfgAreaSelectedValue.length; ++i){
                mfgAreaSelectedValueDisplayList.push(mfgAreaSelectedValue[i].value + " ")
            }
            this.setState({
                mfgAreaSelectedValueDisplay:mfgAreaSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                for(let i=0; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeProductFamily(productFamilySelectedValue){
        console.log(productFamilySelectedValue)
        
        this.setState({
            productFamilySelectedValue
        },()=>{
            var productFamilySelectedValueDisplayList = []
            for (let i = 0; i < this.state.productFamilySelectedValue.length; ++i){
                productFamilySelectedValueDisplayList.push(productFamilySelectedValue[i].value + " ")
            }
            this.setState({
                productFamilySelectedValueDisplay:productFamilySelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                paramArray_1[0] = this.state.productFamilySelectedValue
                paramArray_1[1] = this.state.productFamilySelectedValueDisplay
                for(let i=2; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeProduct(productSelectedValue){
        console.log(productSelectedValue)
        
        this.setState({
            productSelectedValue
        },()=>{
            var productSelectedValueDisplayList = []
            for (let i = 0; i < this.state.productSelectedValue.length; ++i){
                productSelectedValueDisplayList.push(productSelectedValue[i].value + " ")
            }
            this.setState({
                productSelectedValueDisplay:productSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                paramArray_1[0] = this.state.productFamilySelectedValue
                paramArray_1[1] = this.state.productFamilySelectedValueDisplay
                paramArray_1[2] = this.state.productSelectedValue
                paramArray_1[3] = this.state.productSelectedValueDisplay
                for(let i=4; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeLotType(lotTypeSelectedValue){
        console.log(lotTypeSelectedValue)
        
        this.setState({
            lotTypeSelectedValue
        },()=>{
            var lotTypeSelectedValueDisplayList = []
            for (let i = 0; i < this.state.lotTypeSelectedValue.length; ++i){
                lotTypeSelectedValueDisplayList.push(lotTypeSelectedValue[i].value + " ")
            }
            this.setState({
                lotTypeSelectedValueDisplay:lotTypeSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                paramArray_1[0] = this.state.productFamilySelectedValue
                paramArray_1[1] = this.state.productFamilySelectedValueDisplay
                paramArray_1[2] = this.state.productSelectedValue
                paramArray_1[3] = this.state.productSelectedValueDisplay
                paramArray_1[4] = this.state.lotTypeSelectedValue
                paramArray_1[5] = this.state.lotTypeSelectedValueDisplay
                for(let i=6; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeProject(projectSelectedValue){
        console.log(projectSelectedValue)
        
        this.setState({
            projectSelectedValue
        },()=>{
            var projectSelectedValueDisplayList = []
            for (let i = 0; i < this.state.projectSelectedValue.length; ++i){
                projectSelectedValueDisplayList.push(projectSelectedValue[i].value + " ")
            }
            this.setState({
                projectSelectedValueDisplay:projectSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                paramArray_1[0] = this.state.productFamilySelectedValue
                paramArray_1[1] = this.state.productFamilySelectedValueDisplay
                paramArray_1[2] = this.state.productSelectedValue
                paramArray_1[3] = this.state.productSelectedValueDisplay
                paramArray_1[4] = this.state.lotTypeSelectedValue
                paramArray_1[5] = this.state.lotTypeSelectedValueDisplay
                paramArray_1[6] = this.state.projectSelectedValue
                paramArray_1[7] = this.state.projectSelectedValueDisplay
                for(let i=8; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeMCN(mcnSelectedValue){
        console.log(mcnSelectedValue)
        
        this.setState({
            mcnSelectedValue
        },()=>{
            var mcnSelectedValueDisplayList = []
            for (let i = 0; i < this.state.mcnSelectedValue.length; ++i){
                mcnSelectedValueDisplayList.push(mcnSelectedValue[i].value + " ")
            }
            this.setState({
                mcnSelectedValueDisplay:mcnSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                paramArray_1[0] = this.state.productFamilySelectedValue
                paramArray_1[1] = this.state.productFamilySelectedValueDisplay
                paramArray_1[2] = this.state.productSelectedValue
                paramArray_1[3] = this.state.productSelectedValueDisplay
                paramArray_1[4] = this.state.lotTypeSelectedValue
                paramArray_1[5] = this.state.lotTypeSelectedValueDisplay
                paramArray_1[6] = this.state.projectSelectedValue
                paramArray_1[7] = this.state.projectSelectedValueDisplay
                paramArray_1[8] = this.state.mcnSelectedValue
                paramArray_1[9] = this.state.mcnSelectedValueDisplay
                for(let i=10; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangePartIdMaskSet(partIdMaskSetSelectedValue){
        console.log(partIdMaskSetSelectedValue)
        
        this.setState({
            partIdMaskSetSelectedValue
        },()=>{
            var partIdMaskSetSelectedValueDisplayList = []
            for (let i = 0; i < this.state.partIdMaskSetSelectedValue.length; ++i){
                partIdMaskSetSelectedValueDisplayList.push(partIdMaskSetSelectedValue[i].value + " ")
            }
            this.setState({
                partIdMaskSetSelectedValueDisplay:partIdMaskSetSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                paramArray_1[0] = this.state.productFamilySelectedValue
                paramArray_1[1] = this.state.productFamilySelectedValueDisplay
                paramArray_1[2] = this.state.productSelectedValue
                paramArray_1[3] = this.state.productSelectedValueDisplay
                paramArray_1[4] = this.state.lotTypeSelectedValue
                paramArray_1[5] = this.state.lotTypeSelectedValueDisplay
                paramArray_1[6] = this.state.projectSelectedValue
                paramArray_1[7] = this.state.projectSelectedValueDisplay
                paramArray_1[8] = this.state.mcnSelectedValue
                paramArray_1[9] = this.state.mcnSelectedValueDisplay
                paramArray_1[10] = this.state.partIdMaskSetSelectedValue
                paramArray_1[11] = this.state.partIdMaskSetSelectedValueDisplay
                for(let i=12; i<14; i++){
                    paramArray_1[i] = []
                }
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangePartId(partIdSelectedValue){
        console.log(partIdSelectedValue)
        
        this.setState({
            partIdSelectedValue
        },()=>{
            var partIdSelectedValueDisplayList = []
            for (let i = 0; i < this.state.partIdSelectedValue.length; ++i){
                partIdSelectedValueDisplayList.push(partIdSelectedValue[i].value + " ")
            }
            this.setState({
                partIdSelectedValueDisplay:partIdSelectedValueDisplayList
            },()=>{
                var paramArray_1 = []
                paramArray_1[0] = this.state.productFamilySelectedValue
                paramArray_1[1] = this.state.productFamilySelectedValueDisplay
                paramArray_1[2] = this.state.productSelectedValue
                paramArray_1[3] = this.state.productSelectedValueDisplay
                paramArray_1[4] = this.state.lotTypeSelectedValue
                paramArray_1[5] = this.state.lotTypeSelectedValueDisplay
                paramArray_1[6] = this.state.projectSelectedValue
                paramArray_1[7] = this.state.projectSelectedValueDisplay
                paramArray_1[8] = this.state.mcnSelectedValue
                paramArray_1[9] = this.state.mcnSelectedValueDisplay
                paramArray_1[10] = this.state.partIdMaskSetSelectedValue
                paramArray_1[11] = this.state.partIdMaskSetSelectedValueDisplay
                paramArray_1[12] = this.state.partIdSelectedValue
                paramArray_1[13] = this.state.partIdSelectedValueDisplay
                this.initStateGroup_1(paramArray_1)

                var paramArray_2 = []
                for(let i=0; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeProcessArea(processAreaSelectedValue){
        console.log(processAreaSelectedValue)
        
        this.setState({
            processAreaSelectedValue
        },()=>{
            var processAreaSelectedValueDisplayList = []
            for (let i = 0; i < this.state.processAreaSelectedValue.length; ++i){
                processAreaSelectedValueDisplayList.push(processAreaSelectedValue[i].value + " ")
            }
            this.setState({
                processAreaSelectedValueDisplay:processAreaSelectedValueDisplayList
            },()=>{
                var paramArray_2 = []
                paramArray_2[0] = this.state.processAreaSelectedValue
                paramArray_2[1] = this.state.processAreaSelectedValueDisplay
                for(let i=2; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeOperation(operationSelectedValue){
        console.log(operationSelectedValue)
        
        this.setState({
            operationSelectedValue
        },()=>{
            var operationSelectedValueDisplayList = []
            for (let i = 0; i < this.state.operationSelectedValue.length; ++i){
                operationSelectedValueDisplayList.push(operationSelectedValue[i].value + " ")
            }
            this.setState({
                operationSelectedValueDisplay:operationSelectedValueDisplayList
            },()=>{
                var paramArray_2 = []
                paramArray_2[0] = this.state.processAreaSelectedValue
                paramArray_2[1] = this.state.processAreaSelectedValueDisplay
                paramArray_2[2] = this.state.operationSelectedValue
                paramArray_2[3] = this.state.operationSelectedValueDisplay
                for(let i=4; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeSubOperation(subOperationSelectedValue){
        console.log(subOperationSelectedValue)
        
        this.setState({
            subOperationSelectedValue
        },()=>{
            var subOperationSelectedValueDisplayList = []
            for (let i = 0; i < this.state.subOperationSelectedValue.length; ++i){
                subOperationSelectedValueDisplayList.push(subOperationSelectedValue[i].value + " ")
            }
            this.setState({
                subOperationSelectedValueDisplay:subOperationSelectedValueDisplayList
            },()=>{
                var paramArray_2 = []
                paramArray_2[0] = this.state.processAreaSelectedValue
                paramArray_2[1] = this.state.processAreaSelectedValueDisplay
                paramArray_2[2] = this.state.operationSelectedValue
                paramArray_2[3] = this.state.operationSelectedValueDisplay
                paramArray_2[4] = this.state.subOperationSelectedValue
                paramArray_2[5] = this.state.subOperationSelectedValueDisplay
                for(let i=6; i<8; i++){
                    paramArray_2[i] = []
                }
                this.initStateGroup_2(paramArray_2)
            })
        });
    }

    handleChangeEquipment(equipmentSelectedValue){
        console.log(equipmentSelectedValue)
        
        this.setState({
            equipmentSelectedValue
        },()=>{
            var equipmentSelectedValueDisplayList = []
            for (let i = 0; i < this.state.equipmentSelectedValue.length; ++i){
                equipmentSelectedValueDisplayList.push(equipmentSelectedValue[i].value + " ")
            }
            this.setState({
                equipmentSelectedValueDisplay:equipmentSelectedValueDisplayList
            },()=>{
                var paramArray_2 = []
                paramArray_2[0] = this.state.processAreaSelectedValue
                paramArray_2[1] = this.state.processAreaSelectedValueDisplay
                paramArray_2[2] = this.state.operationSelectedValue
                paramArray_2[3] = this.state.operationSelectedValueDisplay
                paramArray_2[4] = this.state.subOperationSelectedValue
                paramArray_2[5] = this.state.subOperationSelectedValueDisplay
                paramArray_2[6] = this.state.equipmentSelectedValue
                paramArray_2[7] = this.state.equipmentSelectedValueDisplay
                this.initStateGroup_2(paramArray_2)
            })
        });
    }



    sendRequestForSelectionDropDown(title, url){
        axios({
            url: url,
            method: 'get',
            headers: {
                'X-CSRFToken': 'csrf_token',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params:{
                'TITLE': JSON.stringify(title),
                'TECHNOLOGY': JSON.stringify(this.state.technologySelectedValue),
                'DATA_TYPE': JSON.stringify(this.state.dataTypeSelectedValue),
                'MFG_AREA_NAME': JSON.stringify(this.state.mfgAreaSelectedValue),
                'PRODUCT_FAMILY': JSON.stringify(this.state.productFamilySelectedValue),
                'PRODUCT': JSON.stringify(this.state.productSelectedValue),
                'LOT_TYPE': JSON.stringify(this.state.lotTypeSelectedValue),
                'PROJECT': JSON.stringify(this.state.projectSelectedValue),
                'MCN': JSON.stringify(this.state.mcnSelectedValue),
                'PRODUCT_MASK_SET': JSON.stringify(this.state.partIdMaskSetSelectedValue),
                'PRODUCT_ID': JSON.stringify(this.state.partIdSelectedValue),
                'PROCESS_AREA': JSON.stringify(this.state.processAreaSelectedValue),
                'OPERATION': JSON.stringify(this.state.operationSelectedValue),
                'SUB_OPERATION': JSON.stringify(this.state.subOperationSelectedValue),
                'EQUIP': JSON.stringify(this.state.equipmentSelectedValue),
            },
            paramsSerializer: function(params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        }).then((response ) => {  
            if(title == "TECHNOLOGY"){
                this.setState({technologyOptions:response.data},()=>{return});
            }else if(title == "DATA_TYPE"){
                this.setState({dataTypeOptions:response.data},()=>{return});
            }else if(title == "MFG_AREA_NAME"){
                this.setState({mfgAreaOptions:response.data},()=>{return});
            }else if(title == "PRODUCT_FAMILY"){
                this.setState({productFamilyOptions:response.data},()=>{return});
            }else if(title == "PRODUCT"){
                this.setState({productOptions:response.data},()=>{return});
            }else if(title == "LOT_TYPE"){
                this.setState({lotTypeOptions:response.data},()=>{return});
            }else if(title == "PROJECT"){
                this.setState({projectOptions:response.data},()=>{return});
            }else if(title == "MCN"){
                this.setState({mcnOptions:response.data},()=>{return});
            }else if(title == "PRODUCT_MASK_SET"){
                this.setState({partIdMaskSetOptions:response.data},()=>{return});
            }else if(title == "PRODUCT_ID"){
                this.setState({partIdOptions:response.data},()=>{return});
            }else if(title == "PROCESS_AREA"){
                this.setState({processAreaOptions:response.data},()=>{return});
            }else if(title == "OPERATION"){
                this.setState({operationOptions:response.data},()=>{return});
            }else if(title == "SUB_OPERATION"){
                this.setState({subOperationOptions:response.data},()=>{return});
            }else if(title == "EQUIPMENT"){
                this.setState({equipmentOptions:response.data},()=>{return});
            }else{
                return
            }
        }).catch((error) => {
            console.log(error)
        })    
    }

    //the function is used to update the dropdown menu, the sequence in the function needed to be concerned.

    handleTechnologyDropDown(){
        this.setState({
            //technologyOptions: [],
            technologySelectedValue: [],
            technologySelectedValueDisplay: [],
        },()=>{
            this.handleChangeTechnology([])
        });
        this.sendRequestForSelectionDropDown("TECHNOLOGY","/backend/menulist")
    }

    /*
    const dataTypeList = lotSelectionList[1]['list'].map(e=>({value: e.name, label: e.name}))
        this.setState({
            dataTypeOptions:dataTypeList,
           dataTypeSelectedValue: [],
            dataTypeSelectedValueDisplay: []
        },()=>{
            return
        });
    */

    handleDataTypeDropDown(){
        this.setState({
            //dataTypeOptions: [],
            dataTypeSelectedValue: [],
            dataTypeSelectedValueDisplay: [],
        },()=>{
            this.handleChangeDataType([])
        });
        this.sendRequestForSelectionDropDown("DATA_TYPE","/backend/menulist")
    }

    handleMfgAreaDropDown(){
        this.setState({
            //mfgAreaOptions: [],
            mfgAreaSelectedValue: [],
            mfgAreaSelectedValueDisplay: [],
        },()=>{
            this.handleChangeMfgArea([])
        });
        this.sendRequestForSelectionDropDown("MFG_AREA_NAME","/backend/menulist")
    }

    handleProductFamilyDropDown(){
        this.setState({
            //productFamilyOptions: [],
            productFamilySelectedValue: [],
            productFamilySelectedValueDisplay: [],
        },()=>{
            this.handleChangeProductFamily([])
        });
        this.sendRequestForSelectionDropDown("PRODUCT_FAMILY","/backend/menulist")
    }

    handleProductDropDown(){
        this.setState({
            //productOptions: [],
            productSelectedValue: [],
            productSelectedValueDisplay: []
        },()=>{
            this.handleChangeProduct([])
        });
        this.sendRequestForSelectionDropDown("PRODUCT","/backend/menulist")
    }

    handleLotTypeDropDown(){
        this.setState({
            //lotTypeOptions: [],
            lotTypeSelectedValue: [],
            lotTypeSelectedValueDisplay: []
        },()=>{
            this.handleChangeLotType([])
        });
        this.sendRequestForSelectionDropDown("LOT_TYPE","/backend/menulist")
    }

    handleProjectDropDown(){
        this.setState({
            //projectOptions: [],
            projectSelectedValue: [],
            projectSelectedValueDisplay: []
        },()=>{
            this.handleChangeProject([])
        });
        this.sendRequestForSelectionDropDown("PROJECT","/backend/menulist")
    }

    handleMCNDropDown(){
        this.setState({
            //mcnOptions: [],
            mcnSelectedValue: [],
            mcnSelectedValueDisplay: []
        },()=>{
            this.handleChangeMCN([])
        });
        this.sendRequestForSelectionDropDown("MCN","/backend/menulist")
    }

    handlePartIdMaskSetDropDown(){
        this.setState({
            //partIdMaskSetOptions: [],
            partIdMaskSetSelectedValue: [],
            partIdMaskSetSelectedValueDisplay: []
        },()=>{
            this.handleChangePartIdMaskSet([])
        });
        this.sendRequestForSelectionDropDown("PRODUCT_MASK_SET","/backend/menulist")
    }

    handlePartIdDropDown(){
        this.setState({
            //partIdOptions: [],
            partIdSelectedValue: [],
            partIdSelectedValueDisplay: []
        },()=>{
            this.handleChangePartId([])
        });
        this.sendRequestForSelectionDropDown("PRODUCT_ID","/backend/menulist")
    }

    handleProcessAreaDropDown(){
        this.setState({
            //processAreaOptions: [],
            processAreaSelectedValue: [],
            processAreaSelectedValueDisplay: []
        },()=>{
            this.handleChangeProcessArea([])
        });
        this.sendRequestForSelectionDropDown("PROCESS_AREA","/backend/menulist")
    }

    handleOperationDropDown(){
        this.setState({
            //operationOptions: [],
            operationSelectedValue: [],
            operationSelectedValueDisplay: []
        },()=>{
            this.handleChangeOperation([])
        });
        this.sendRequestForSelectionDropDown("OPERATION","/backend/menulist")
    }

    handleSubOperationDropDown(){
        this.setState({
            //subOperationOptions: [],
            subOperationSelectedValue: [],
            subOperationSelectedValueDisplay: []
        },()=>{
            this.handleChangeSubOperation([])
        });
        this.sendRequestForSelectionDropDown("SUB_OPERATION","/backend/menulist")
    }

    handleEquipmentDropDown(){
        this.setState({
            //equipmentOptions: [],
            equipmentSelectedValue: [],
            equipmentSelectedValueDisplay: []
        },()=>{
            this.handleChangeEquipment([])
        });
        this.sendRequestForSelectionDropDown("EQUIPMENT","/backend/menulist")
    }




    

    /* Date calendar Option */
    handleClickCalendarOptionsDate() {
        this.setState({
            calendarOption: 'Date'
        });
    }

    handleChangeDateStartDate(event) {
        const newStartDateComponents = event.target.value.split('-');
        const newStartDateYear = parseInt(newStartDateComponents[0]);
        const newStartDateMonth = parseInt(newStartDateComponents[1]);
        const newStartDateDay = parseInt(newStartDateComponents[2]);
        const newStartDate = [newStartDateYear, newStartDateMonth, newStartDateDay];

        this.setState({
            calendarOptionDate: {
                ...this.state.calendarOptionDate,
                startDate: newStartDate
            }
        }, () => {
            return;
        });
    }

    handleChangeDateStartTime(event) {
        const newStartTimeComponents = event.target.value.split(':');
        const newStartTimeHours = parseInt(newStartTimeComponents[0]);
        const newStartTimeMinutes = parseInt(newStartTimeComponents[1]);
        const newStartTime = [newStartTimeHours, newStartTimeMinutes];

        this.setState({
            calendarOptionDate: {
                ...this.state.calendarOptionDate,
                startTime: newStartTime
            }
        }, () => {
            return;
        });
    }

    handleChangeDateEndDate(event) {
        const newEndDateComponents = event.target.value.split('-');
        const newEndDateYear = parseInt(newEndDateComponents[0]);
        const newEndDateMonth = parseInt(newEndDateComponents[1]);
        const newEndDateDay = parseInt(newEndDateComponents[2]);
        const newEndDate = [newEndDateYear, newEndDateMonth, newEndDateDay];

        this.setState({
            calendarOptionDate: {
                ...this.state.calendarOptionDate,
                endDate: newEndDate
            }
        }, () => {
            return;
        });
    }

    handleChangeDateEndTime(event) {
        const newEndTimeComponents = event.target.value.split(':');
        const newEndTimeHours = parseInt(newEndTimeComponents[0]);
        const newEndTimeMinutes = parseInt(newEndTimeComponents[1]);
        const newEndTime = [newEndTimeHours, newEndTimeMinutes];

        this.setState({
            calendarOptionDate: {
                ...this.state.calendarOptionDate,
                endTime: newEndTime
            }
        }, () => {
            return;
        });
    }






    /* Last n Days/Lots calendar option */
    handleClickCalendarOptionsLastNDaysLots() {
        this.setState({
            calendarOption: 'Last n Days/Lots'
        });
    }

    // Last Days Radio Button
    handleClickLastNDaysLotsLastDaysRadioButton() {
        this.setState({
            calendarOptionLastNDaysLots: {
                ...this.state.calendarOptionLastNDaysLots,
                radioButton: 'Last Days'
            }
        }, () => {
            return;
        });
    }

    // Last Lots Radio Button
    handleClickLastNDaysLotsLastLotsRadioButton() {
        this.setState({
            calendarOptionLastNDaysLots: {
                ...this.state.calendarOptionLastNDaysLots,
                radioButton: 'Last Lots'
            }
        }, () => {
            return;
        });
    }

    // Last Days Input
    handleChangeLastNDaysLotsLastDaysTotal(event) {
        /* input type="number" allows for entering the character 'e', so must check for this. In this case, DO NOT change the state */
        if (!isNaN(parseInt(event.target.value))) {
            const inputNumber = Math.floor(parseInt(event.target.value));
            this.setState({
                calendarOptionLastNDaysLots: {
                    ...this.state.calendarOptionLastNDaysLots,
                    lastDaysTotal: inputNumber
                }
            }, () => {
                return;
            });
        }
    }

    // Last Lots Input
    handleChangeLastNDaysLotsLastLotsTotal(event) {
        /* input type="number" allows for entering the character 'e', so must check for this. In this case, DO NOT change the state */
        if (!isNaN(parseInt(event.target.value))) {
            const inputNumber = Math.floor(parseInt(event.target.value));
            this.setState({
                calendarOptionLastNDaysLots: {
                    ...this.state.calendarOptionLastNDaysLots,
                    lastLotsTotal: inputNumber
                }
            }, () => {
                return;
            });
        }
    }




    /* Calendar Rule calendar option */
    handleClickCalendarOptionsCalendarRule() {
        this.setState({
            calendarOption: 'Calendar Rule'
        });
    }

    // Period Radio Button
    handleClickCalendarRulePeriodRadioButton() {
        this.setState({
            calendarOptionCalendarRule: {
                ...this.state.calendarOptionCalendarRule,
                radioButton: 'Period'
            }
        }, () => {
            return;
        });
    }

    // Last radio button
    handleClickCalendarRuleLastRadioButton() {
        this.setState({
            calendarOptionCalendarRule: {
                ...this.state.calendarOptionCalendarRule,
                radioButton: 'Last'
            }
        }, () => {
            return;
        });
    }

    // Period time format
    handleChangeCalendarRulePeriodTimeFormat(event) {
        this.setState({
            calendarOptionCalendarRule: {
                ...this.state.calendarOptionCalendarRule,
                periodTimeFormat: event.target.value
            }
        }, () => {
            return;
        })
    }

    // Period start time
    handleChangeCalendarRulePeriodTimeStart(event) {
       /* input type="number" allows for entering the character 'e', so must check for this. In this case, DO NOT change the state. */
        if (!isNaN(parseInt(event.target.value))) {
            const inputNumber = Math.floor(parseInt(event.target.value));
            this.setState({
                calendarOptionCalendarRule: {
                    ...this.state.calendarOptionCalendarRule,
                    periodTimeStart: inputNumber
                }
            }, () => {
                return;
            });
        }
    }

    // Period time end
    handleChangeCalendarRulePeriodTimeEnd(event) {
        /* input type="number" allows for entering the character 'e', so must check for this. In this case, DO NOT change the state. */
        if (!isNaN(parseInt(event.target.value))) {
            const inputNumber = Math.floor(parseInt(event.target.value));
            this.setState({
                calendarOptionCalendarRule: {
                    ...this.state.calendarOptionCalendarRule,
                    periodTimeEnd: inputNumber
                }
            }, () => {
                return;
            });
        }
    }

    // Last Total
    handleChangeCalendarRuleLastTotal(event) {
        /* input type="number" allows for entering the character 'e', so must check for this. In this case, DO NOT change the state */
        if (!isNaN(parseInt(event.target.value))) {
            const inputNumber = Math.floor(parseInt(event.target.value));
            this.setState({
                calendarOptionCalendarRule: {
                    ...this.state.calendarOptionCalendarRule,
                    lastTotal: inputNumber
                }
            }, () => {
                return;
            })
        }
    }

    // Last time format
    handleChangeCalendarRuleLastTimeFormat(event) {
        this.setState({
            calendarOptionCalendarRule: {
                ...this.state.calendarOptionCalendarRule,
                lastTimeFormat: event.target.value
            }
        }, () => {
            return;
        })
    }




    //Get Lot Id

    sendRequestGetLotId(url) {
        axios({
            url: url,
            method: 'get',
            headers: {
                'X-CSRFToken': 'csrf_token',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params:{
                'TECHNOLOGY': JSON.stringify(this.state.technologySelectedValue),
                'DATA_TYPE': JSON.stringify(this.state.dataTypeSelectedValue),
                'MFG_AREA_NAME': JSON.stringify(this.state.mfgAreaSelectedValue),
                'PRODUCT_FAMILY': JSON.stringify(this.state.productFamilySelectedValue),
                'PRODUCT': JSON.stringify(this.state.productSelectedValue),
                'LOT_TYPE': JSON.stringify(this.state.lotTypeSelectedValue),
                'PROJECT': JSON.stringify(this.state.projectSelectedValue),
                'MCN': JSON.stringify(this.state.mcnSelectedValue),
                'PRODUCT_MASK_SET': JSON.stringify(this.state.partIdMaskSetSelectedValue),
                'PRODUCT_ID': JSON.stringify(this.state.partIdSelectedValue),
                'PROCESS_AREA': JSON.stringify(this.state.processAreaSelectedValue),
                'OPERATION': JSON.stringify(this.state.operationSelectedValue),
                'SUB_OPERATION': JSON.stringify(this.state.subOperationSelectedValue),
                'EQUIP': JSON.stringify(this.state.equipmentSelectedValue),
                'CALENDAR_OPTION': JSON.stringify(this.state.calendarOption),                                         
                'CALENDAR_OPTION_DATE': JSON.stringify(this.state.calendarOptionDate),  /* '{ "startDate": [2021, 11, 3], "startTime": [6, 30], "endDate": [2021, 11, 4], "endTime:" [7, 30] }' */
                'CALENDAR_OPTION_LAST_N_DAYS_LOTS': JSON.stringify(this.state.calendarOptionLastNDaysLots), /* '{ "radioButton": "Last Days", "lastDaysTotal": 1, "lastLotsTotal": 1}' */
                'CALENDAR_OPTION_CALENDAR_RULE' : JSON.stringify(this.state.calendarOptionCalendarRule) /* '{ "radioButton": "Period", "periodTimeFormat": "Hours", "periodTimeStart": 1, "periodTimeEnd": 1, "lastTimeFormat": "Hours", "lastTotal": 1 }' */
            },
            paramsSerializer: function(params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        }).then((response ) => {  
           console.log(response.data);
           console.log(this.state.lotIdContainerOptions);
           this.setState({
               lotIdContainerOptions: response.data
           }, () => {
            console.log(this.state.lotIdContainerOptions);
           });
        }).catch((error) => {
            console.log(error)
        }) 
    }

    handleClickGetLotId(event){
        event.preventDefault();
        console.log("Get Lot Id")
        this.sendRequestGetLotId("/backend/getLotId");
    }






    sendRequestForDataTypeList(){
        axios({
            url: "/backend/datatype",
            method: 'get',
            headers: {
                'X-CSRFToken': 'csrf_token',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params:{
                'SELECTED_LOT_ID': JSON.stringify(this.state.lotIdContainerSelectedValue),
                'SELECTED_AGGREGATION_LEVEL': JSON.stringify(this.state.dataRetrievalAggregationLevel),
            },
            paramsSerializer: function(params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        }).then((response ) => {  
            console.log(response.data)
            this.setState({dataTypeListDisplay:response.data},()=>{return});
        }).catch((error) => {
            console.log(error)
        })
    }

    //handle with the selection change of lot id container
    handleChangeLotIdContainer(lotIdContainerSelectedValue){
        console.log(lotIdContainerSelectedValue)

        this.setState({
            lotIdContainerSelectedValue,
            dataRetrievalTypes: [],                             
            dataRetrievalTypeClicked: '',
            dataTypeListDisplay: {}
        },()=>{
            this.sendRequestForDataTypeList()
            return
        });
    }




    /***** Data Retrieval - Aggregation Level*****/
    // Lot radio button
    handleClickAggregationLevelLotRadioButton() {
        this.setState({
            dataRetrievalAggregationLevel: 'Lot',
            dataRetrievalTypes: [],                             
            dataRetrievalTypeClicked: '',
            dataTypeListDisplay: {}
        }, () => {
            this.sendRequestForDataTypeList()
        });
    }

    // Wafer radio button
    handleClickAggregationLevelWaferRadioButton() {
        this.setState({
            dataRetrievalAggregationLevel: 'Wafer',
            dataRetrievalTypes: [],                             
            dataRetrievalTypeClicked: '',
            dataTypeListDisplay: {}
        }, () => {
            this.sendRequestForDataTypeList()
            return
        });
    }

    // Unit radio button
    handleClickAggregationLevelUnitRadioButton() {
        this.setState({
            dataRetrievalAggregationLevel: 'Unit',
            dataRetrievalTypes: [],                             
            dataRetrievalTypeClicked: '',
            dataTypeListDisplay: {}
        }, () => {
            this.sendRequestForDataTypeList()
            return
        });
    }

    // Extra check box
    handleClickAggregationLevelExtraCheckBox() {
        this.setState({
            dataRetrievalAggregationLevelExtra: !this.state.dataRetrievalAggregationLevelExtra
        }, () => {
            return;
        });
    }



    /***** Data Retrieveal - Retrieve Parameter By *****/
    handleClickRetrieveParameterByNoneRadioButton() {
        this.setState({
            dataRetrievalRetrieveParameterBy: 'None'
        }, () => {
            return;
        });
    }

    handleClickRetrieveParameterByProductRadioButton() {
        this.setState({
            dataRetrievalRetrieveParameterBy: 'Product'
        }, () => {
            this.setState({
                dataRetrievalTypeClicked: ""
            },() => {
                return;
            });
        });
    }

    handleClickRetrieveParameterByLotRadioButton() {
        this.setState({
            dataRetrievalRetrieveParameterBy: 'Lot'
        }, () => {
            this.setState({
                dataRetrievalTypeClicked: ""
            },() => {
                return;
            });
        });
    }

    // Data type
    handleClickDataTypeCheckBox(event) {
        const typeSelected = event.target.value;

        // unchecked the box - remove item
        if (this.state.dataRetrievalTypes.includes(typeSelected)) {
            this.setState({
                dataRetrievalTypes: this.state.dataRetrievalTypes.filter(function(type) {
                    return type !== typeSelected;
                })
            }, () => {
                if (this.state.dataRetrievalTypeClicked == typeSelected){
                    this.setState({
                        dataRetrievalTypeClicked: ""
                    });
                }
                return;
            });
        }
        // checked the box - add item
        else {
            this.setState(prevState => ({
                dataRetrievalTypes: [...prevState.dataRetrievalTypes, typeSelected]
            }), () => {
                return;
            });
        }
    }


    //this part connects to backend to retrieve the parameters

    sendRequestForDataTypeOpertionMenuList(title){
        axios({
            url: "/backend/datatype/OperationMenuList",
            method: 'get',
            headers: {
                'X-CSRFToken': 'csrf_token',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params:{
                'TITLE': JSON.stringify(title),
                'SELECTED_LOT_ID': JSON.stringify(this.state.lotIdContainerSelectedValue),
                'SELECTED_RETRIEVE_PARAMETER': JSON.stringify(this.state.dataRetrievalRetrieveParameterBy),
                'SELECTED_DATA_TYPE_CLICKED': JSON.stringify(this.state.dataRetrievalTypeClicked),
                'SELECTED_DATA_TYPE_WP_OPERATION': JSON.stringify(this.state.dataRetrievalWPOperationMenuListSelectedValue),
                'SELECTED_DATA_TYPE_PCM_OPERATION': JSON.stringify(this.state.dataRetrievalPCMOperationMenuListSelectedValue),

                'TECHNOLOGY': JSON.stringify(this.state.technologySelectedValue),
                'MFG_AREA_NAME': JSON.stringify(this.state.mfgAreaSelectedValue),
                'PRODUCT_FAMILY': JSON.stringify(this.state.productFamilySelectedValue),
                'PRODUCT': JSON.stringify(this.state.productFamilySelectedValue),
            },
            paramsSerializer: function(params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        }).then((response ) => { 
            if (response.data.title !== "WPOperation" && response.data.title !== "PCMOperation"){
                if (response.data.title === "WP"){
                    this.setState({
                        parameterContainerOptions: response.data["dataTypeParameters"],
                        dataRetrievalWPOperationMenuList: response.data["operationMenuList"]
                    }, () => {
                        return;
                    });
                }
                if (response.data.title === "PCM"){
                    this.setState({
                        parameterContainerOptions: response.data["dataTypeParameters"],
                        dataRetrievalPCMOperationMenuList: response.data["operationMenuList"]
                    }, () => {
                        return;
                    });
                }
                if (response.data.title === "WIP"){
                    this.setState({
                        parameterContainerOptions: response.data["operationMenuList"],
                        dataRetrievalWIPOperationMenuList: response.data["operationMenuList"]
                    }, () => {
                        return;
                    });
                } 
                if (response.data.title === "not_developed"){
                    alert("Not developed yet!")
                }
            }else{
                this.setState({
                    parameterContainerOptions: response.data["dataTypeParameters"],
                }, () => {
                    return;
                });
            }
        }).catch((error) => {
            console.log(error)
        })
    }



    handleClickDataTypeToRetrieveParameter = (event) => {
        this.setState({
            dataRetrievalTypeClicked: event,
            dataRetrievalWPOperationMenuListSelectedValue: 'All',
            dataRetrievalPCMOperationMenuListSelectedValue: 'All',
            dataRetrievalTypesChecked: false,
        }, () => {
            this.sendRequestForDataTypeOpertionMenuList(event)
            return;
        });
    }

    handleChangeDataTypeWPOperation = (event) => {
        this.setState({
            dataRetrievalWPOperationMenuListSelectedValue:event.target.value
        }, () => {
            this.sendRequestForDataTypeOpertionMenuList("WPOperation")
            return;
        });
    }

    handleChangeDataTypePCMOperation = (event) => {
        this.setState({
            dataRetrievalPCMOperationMenuListSelectedValue:event.target.value
        }, () => {
            this.sendRequestForDataTypeOpertionMenuList("PCMOperation")
            return;
        });
    }

    handleClickUseSubOperations = (event) => {
        this.setState(prevState => ({
            dataRetrievalUseSubOperations: !prevState.dataRetrievalUseSubOperations
        }), () => {
            return;
        });
    }

    handleChangeWIPParameterContainer(parameterContainerWIPSelectedValue){
        console.log(parameterContainerWIPSelectedValue)

        this.setState({
            parameterContainerWIPSelectedValue
        },()=>{
            return
        });
    }

    handleChangeWPParameterContainer(parameterContainerWPSelectedValue){
        console.log(parameterContainerWPSelectedValue)

        this.setState({
            parameterContainerWPSelectedValue
        },()=>{
            return
        });
    }

    handleChangePCMParameterContainer(parameterContainerPCMSelectedValue){
        console.log(parameterContainerPCMSelectedValue)

        this.setState({
            parameterContainerPCMSelectedValue
        },()=>{
            return
        });
    }




    //submit all selection values to form a json file

    sendRequestForJsonForm(url) {
        axios({
            url: url,
            method: 'get',
            headers: {
                'X-CSRFToken': 'csrf_token',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params:{
                'TECHNOLOGY': JSON.stringify(this.state.technologySelectedValue),
                'DATA_TYPE': JSON.stringify(this.state.dataTypeSelectedValue),
                'MFG_AREA_NAME': JSON.stringify(this.state.mfgAreaSelectedValue),
                'PRODUCT_FAMILY': JSON.stringify(this.state.productFamilySelectedValue),
                'PRODUCT': JSON.stringify(this.state.productSelectedValue),
                'LOT_TYPE': JSON.stringify(this.state.lotTypeSelectedValue),
                'PROJECT': JSON.stringify(this.state.projectSelectedValue),
                'MCN': JSON.stringify(this.state.mcnSelectedValue),
                'PRODUCT_MASK_SET': JSON.stringify(this.state.partIdMaskSetSelectedValue),
                'PRODUCT_ID': JSON.stringify(this.state.partIdSelectedValue),
                'PROCESS_AREA': JSON.stringify(this.state.processAreaSelectedValue),
                'OPERATION': JSON.stringify(this.state.operationSelectedValue),
                'SUB_OPERATION': JSON.stringify(this.state.subOperationSelectedValue),
                'EQUIP': JSON.stringify(this.state.equipmentSelectedValue),
                'CALENDAR_OPTION': JSON.stringify(this.state.calendarOption),                                         
                'CALENDAR_OPTION_DATE': JSON.stringify(this.state.calendarOptionDate),  /* '{ "startDate": [2021, 11, 3], "startTime": [6, 30], "endDate": [2021, 11, 4], "endTime:" [7, 30] }' */
                'CALENDAR_OPTION_LAST_N_DAYS_LOTS': JSON.stringify(this.state.calendarOptionLastNDaysLots), /* '{ "radioButton": "Last Days", "lastDaysTotal": 1, "lastLotsTotal": 1}' */
                'CALENDAR_OPTION_CALENDAR_RULE' : JSON.stringify(this.state.calendarOptionCalendarRule), /* '{ "radioButton": "Period", "periodTimeFormat": "Hours", "periodTimeStart": 1, "periodTimeEnd": 1, "lastTimeFormat": "Hours", "lastTotal": 1 }' */
                'DATA_RETRIEVAL_AGGREGATION_LEVEL' : JSON.stringify(this.state.dataRetrievalAggregationLevel),
                'DATA_RETRIEVAL_RETRIEVE_PARAMETER_BY' : JSON.stringify(this.state.dataRetrievalRetrieveParameterBy),
                'DATA_RETRIEVAL_TYPES' : JSON.stringify(this.state.dataRetrievalTypes),
                'DATA_RETRIEVAL_WP_OPERATION_MENU_LIST_SELECTED_VALUE' : JSON.stringify(this.state.dataRetrievalWPOperationMenuListSelectedValue),
                'DATA_RETRIEVAL_PCM_OPERATION_MENU_LIST_SELECTED_VALUE' : JSON.stringify(this.state.dataRetrievalPCMOperationMenuListSelectedValue),
                'DATA_RETRIEVAL_USE_SUB_OPERATIONS' : JSON.stringify(this.state.dataRetrievalUseSubOperations),
                'PARAMETER_CONTAINER_WIP_SELECTED_VALUE' : JSON.stringify(this.state.parameterContainerWIPSelectedValue),
                'PARAMETER_CONTAINER_WP_SELECTED_VALUE' : JSON.stringify(this.state.parameterContainerWPSelectedValue),
                'PARAMETER_CONTAINER_PCM_SELECTED_VALUE' : JSON.stringify(this.state.parameterContainerPCMSelectedValue),
            },
            paramsSerializer: function(params) {
                return qs.stringify(params, {arrayFormat: 'repeat'})
            }
        }).then((response ) => {  
           console.log(response.data);
        }).catch((error) => {
            console.log(error)
        }) 
    }

    handleClickSubmitAllParameters(event){
        event.preventDefault();
        console.log("Submit All Parameters")
        this.sendRequestForJsonForm("/backend/parametersSummary")
    }

    render(){

        /*
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
        */

        const ArrowDropDown = () => {
            return(
                <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
            ); 
        };

        const Option = props => {
            return (
                <div>
                    <components.Option {...props}>
                        <input type="checkbox" checked={props.isSelected} onChange={() => null}/>{" "}
                        <label>{props.label}</label>
                    </components.Option>
                </div>
            );
        };

        const NoOptionsMessage = props => {
            return (
               <components.NoOptionsMessage {...props}>
                  loading...
               </components.NoOptionsMessage>
            );
        };

        const TechnologyDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleTechnologyDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const DataTypeDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleDataTypeDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const MfgAreaDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleMfgAreaDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const ProductFamilyDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleProductFamilyDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const ProductDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleProductDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const LotTypeDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleLotTypeDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const ProjectDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleProjectDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const MCNDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleMCNDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const PartIdMaskSetDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handlePartIdMaskSetDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const PartIdDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handlePartIdDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const ProcessAreaDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleProcessAreaDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const OperationDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleOperationDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const SubOperationDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleSubOperationDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const EquipmentDropdownIndicator = ({ children, getValue, ...props }) => {
            return(
                <components.DropdownIndicator {...props}>
                    <div style={{width:"20px", height:"20px"}} onClick = {this.handleEquipmentDropDown}>
                        <ArrowDropDown/>
                    </div>
                </components.DropdownIndicator>
            );
        };

        const dataTypeListDisplay = this.state.dataTypeListDisplay;

        let self = this;

        return(
            <div className="lot-selection">
                <h1>Welcome to the Onto Dashboard Control Panel v1.0</h1>
                <form className="lot-selection-form" onSubmit={this.handleClickSubmitAllParameters}>
                    <div className="lot-selection-form-container">
                        <div className="lot-selection-form-technology-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop: "5px", display:"block"}}>
                                TECHNOLOGY:
                            </span>
                            <Select
                                className="lot-selection-form-technology-select"
                                value={this.state.technologySelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:TechnologyDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="technologyList"
                                onChange={this.handleChangeTechnology}
                                options={this.state.technologyOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-data-type-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                DATA TYPE:
                            </span>
                            <Select
                                className="lot-selection-form-data-type-select"
                                value={this.state.dataTypeSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:DataTypeDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="dataTypeList"
                                onChange={this.handleChangeDataType}
                                options={this.state.dataTypeOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-Mfg-area-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                MFG AREA:
                            </span>
                            <Select
                                className="lot-selection-form-Mfg-area-select"
                                value={this.state.mfgAreaSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:MfgAreaDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="mfgAreaList"
                                onChange={this.handleChangeMfgArea}
                                options={this.state.mfgAreaOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-product-family-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                PRODUCT FAMILY:
                            </span>
                            <Select
                                className="lot-selection-form-product-family-select"
                                value={this.state.productFamilySelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:ProductFamilyDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="productFamilyList"
                                onChange={this.handleChangeProductFamily}
                                options={this.state.productFamilyOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-product-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                PRODUCT:
                            </span>
                            <Select
                                className="lot-selection-form-product-select"
                                value={this.state.productSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:ProductDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="productList"
                                onChange={this.handleChangeProduct}
                                options={this.state.productOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-lot-type-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                LOT TYPE:
                            </span>
                            <Select
                                className="lot-selection-form-lot-type-select"
                                value={this.state.lotTypeSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:LotTypeDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="lotTypeList"
                                onChange={this.handleChangeLotType}
                                options={this.state.lotTypeOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-project-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                PROJECT:
                            </span>

                            <Select
                                className="lot-selection-form-project-select"
                                value={this.state.projectSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:ProjectDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="projectList"
                                onChange={this.handleChangeProject}
                                options={this.state.projectOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-mcn-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                MCN:
                            </span>

                            <Select
                                className="lot-selection-form-mcn-select"
                                value={this.state.mcnSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:MCNDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="mcnList"
                                onChange={this.handleChangeMCN}
                                options={this.state.mcnOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-part-id-mask-set-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                PART ID MASK SET:
                            </span>

                            <Select
                                className="lot-selection-form-part-id-mask-set-select"
                                value={this.state.partIdMaskSetSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:PartIdMaskSetDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="partIdMaskSetList"
                                onChange={this.handleChangePartIdMaskSet}
                                options={this.state.partIdMaskSetOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-part-id-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                PART ID:
                            </span>

                            <Select
                                className="lot-selection-form-part-id-select"
                                value={this.state.partIdSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:PartIdDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="partIdList"
                                onChange={this.handleChangePartId}
                                options={this.state.partIdOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-process-area-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                PROCESS AREA:
                            </span>

                            <Select
                                className="lot-selection-form-process-area-select"
                                value={this.state.processAreaSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:ProcessAreaDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="processAreaList"
                                onChange={this.handleChangeProcessArea}
                                options={this.state.processAreaOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-operation-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                OPERATION:
                            </span>

                            <Select
                                className="lot-selection-form-operation-select"
                                value={this.state.operationSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:OperationDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="operationList"
                                onChange={this.handleChangeOperation}
                                options={this.state.operationOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-sub-operation-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                SUB OPERATION:
                            </span>

                            <Select
                                className="lot-selection-form-sub-operation-select"
                                value={this.state.subOperationSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:SubOperationDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="subOperationList"
                                onChange={this.handleChangeSubOperation}
                                options={this.state.subOperationOptions}
                                styles={customStyles}
                            />
                        </div>
                        <div className="lot-selection-form-equipment-container">
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", display:"block"}}>
                                EQUIPMENT:
                            </span>

                            <Select
                                className="lot-selection-form-equipment-select"
                                value={this.state.equipmentSelectedValue}
                                isMulti={true}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{Option, NoOptionsMessage, DropdownIndicator:EquipmentDropdownIndicator}}
                                isSearchable={true}
                                isClearable={false}
                                placeholder="please select"
                                name="equipmentList"
                                onChange={this.handleChangeEquipment}
                                options={this.state.equipmentOptions}
                                styles={customStyles}
                            />
                        </div>
                    </div>
                    <div className="lot-selection-calendar-options-container">
                        <div className="lot-selection-form-calendar-container">
                            
                            <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft:"0px", marginTop:"5px", marginBottom: "5px", display:"block"}}>
                                    Calendar Selection
                            </span>
                                
                            <button style={{marginRight:"5px"}} type="button" onClick={this.handleClickCalendarOptionsDate}>Date</button>                       
                            <button style={{marginRight:"5px"}} type="button" onClick={this.handleClickCalendarOptionsLastNDaysLots}>Last n Days/Lots</button>
                            <button style={{marginRight:"5px"}} type="button" onClick={this.handleClickCalendarOptionsCalendarRule}>Calendar Rule</button>
                            
                            {/* Date */}
                            {this.state.calendarOption === 'Date' && (
                                <div style={{marginTop: "10px"}}>
                                    <div>
                                        <label>Start Date: </label>
                                        <input
                                            style={{marginLeft: "3px"}}
                                            type="date"
                                            name="start-date"
                                            value={(this.state.calendarOptionDate.startDate.length === 0 ? "" :
                                                (`${this.state.calendarOptionDate.startDate[0]}-` +
                                                (this.state.calendarOptionDate.startDate[1] < 10 ? `0${this.state.calendarOptionDate.startDate[1]}-` : `${this.state.calendarOptionDate.startDate[1]}-`) +
                                                (this.state.calendarOptionDate.startDate[2] < 10 ? `0${this.state.calendarOptionDate.startDate[2]}` : `${this.state.calendarOptionDate.startDate[2]}`))
                                            )}
                                            
                                            onChange={this.handleChangeDateStartDate}
                                        >
                                        </input>
                                    </div>
                                    <div style={{marginTop: "10px"}}>
                                        <label>Start Time: </label>
                                        <input 
                                            type="time"
                                            name="start-time"
                                            onChange={this.handleChangeDateStartTime}
                                            value={(this.state.calendarOptionDate.startTime.length === 0 ? "" :
                                                (this.state.calendarOptionDate.startTime[0] < 10 ? `0${this.state.calendarOptionDate.startTime[0]}:` : `${this.state.calendarOptionDate.startTime[0]}:`) +
                                                (this.state.calendarOptionDate.startTime[1] < 10 ? `0${this.state.calendarOptionDate.startTime[1]}` : `${this.state.calendarOptionDate.startTime[1]}`)
                                            )}
                                            onChange={this.handleChangeDateStartTime}
                                        >
                                        </input>
                                    </div>
                                    <div style={{marginTop: "20px"}}>
                                        <label>End Date: </label>
                                        <input
                                            style={{marginLeft: "7px"}}
                                            type="date"
                                            name="end-date"
                                            value={(this.state.calendarOptionDate.endDate.length === 0 ? "" :
                                                (`${this.state.calendarOptionDate.endDate[0]}-` +
                                                (this.state.calendarOptionDate.endDate[1] < 10 ? `0${this.state.calendarOptionDate.endDate[1]}-` : `${this.state.calendarOptionDate.endDate[1]}-`) +
                                                (this.state.calendarOptionDate.endDate[2] < 10 ? `0${this.state.calendarOptionDate.endDate[2]}` : `${this.state.calendarOptionDate.endDate[2]}`))
                                            )}
                                            onChange={this.handleChangeDateEndDate}
                                        >
                                        </input>
                                    </div>
                                    <div style={{marginTop: "10px"}}>
                                        <label>End Time: </label>
                                        <input 
                                            style={{marginLeft: "5px"}}
                                            type="time"
                                            name="end-time"
                                            value={(this.state.calendarOptionDate.endTime.length === 0 ? "" :
                                                (this.state.calendarOptionDate.endTime[0] < 10 ? `0${this.state.calendarOptionDate.endTime[0]}:` : `${this.state.calendarOptionDate.endTime[0]}:`) +
                                                (this.state.calendarOptionDate.endTime[1] < 10 ? `0${this.state.calendarOptionDate.endTime[1]}` : `${this.state.calendarOptionDate.endTime[1]}`)
                                            )}
                                            onChange={this.handleChangeDateEndTime}
                                        >
                                        </input>
                                    </div>
                                </div>
                                
                            )}

                            {/* Last n Days/Lots */}
                            {this.state.calendarOption === 'Last n Days/Lots' && (
                                <div className="lot-selection-calendar-options-last-days-n-lots-container">
                                    {/* Last Days */}
                                    <div className="lot-selection-calendar-options-last-days-n-lots-last-days-container">
                                        <input 
                                            type="radio" 
                                            name="last-n-days-lots-radio-button" 
                                            value="last-n-days-lots-last-days-radio-button"
                                            id="last-n-days-lots-last-days-radio-button"
                                            onClick={this.handleClickLastNDaysLotsLastDaysRadioButton} 
                                            defaultChecked
                                        />
                                        <label>Last</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={this.state.calendarOptionLastNDaysLots.lastDaysTotal}
                                            onChange={this.handleChangeLastNDaysLotsLastDaysTotal} 
                                        />

                                        <label>Days</label>
                                    </div>
                                    
                                    {/* Last Lots */}
                                    <div>
                                        <input 
                                            type="radio" 
                                            name="last-n-days-lots-radio-button" 
                                            value="last-n-days-lots-last-lots-radio-button"
                                            id="last-n-days-lots-last-lots-radio-button"
                                            onClick={this.handleClickLastNDaysLotsLastLotsRadioButton}
                                        />
                                        <label>Last</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={this.state.calendarOptionLastNDaysLots.lastLotsTotal}
                                            onChange={this.handleChangeLastNDaysLotsLastLotsTotal} 
                                        />
                                        <label>Lots</label>
                                    </div>
                                </div>
                            )}

                            {/* Calendar Rule */}
                            {this.state.calendarOption === 'Calendar Rule' && (
                                <div className="lot-selection-calendar-options-calendar-rule-container">
                                    {/* Period */}
                                    <div className="lot-selection-calendar-options-calendar-rule-period-container">
                                        <input
                                            type="radio" 
                                            name="calendar-rule-radio-button" 
                                            value="calendar-rule-period-radio-button"
                                            id="calendar-rule-period-radio-button"
                                            onClick={this.handleClickCalendarRulePeriodRadioButton} 
                                            defaultChecked
                                        />
                                        <label>Period</label>
                                        <select 
                                            name="calendar-rule-period-time-format-dropdown"
                                            value={this.state.calendarOptionCalendarRule.periodTimeFormat}
                                            onChange={this.handleChangeCalendarRulePeriodTimeFormat}
                                        >
                                            <option value="Hours">Hours</option>
                                            <option value="Days">Days</option>
                                            <option value="Weeks">Weeks</option>
                                        </select>
                                        <label>from</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={this.state.calendarOptionCalendarRule.periodTimeStart}
                                            onChange={this.handleChangeCalendarRulePeriodTimeStart} 
                                        />
                                        <label>to</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={this.state.calendarOptionCalendarRule.periodTimeEnd}
                                            onChange={this.handleChangeCalendarRulePeriodTimeEnd} 
                                        />
                                    </div>
                                    
                                    {/* Last */}
                                    <div className="lot-selection-calendar-options-calendar-rule-last-container">
                                        <input
                                            type="radio" 
                                            name="calendar-rule-radio-button" 
                                            value="calendar-rule-last-radio-button"
                                            id="calendar-rule-last-radio-button"
                                            onClick={this.handleClickCalendarRuleLastRadioButton} 
                                        />
                                        <label>Last</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={this.state.calendarOptionCalendarRule.lastTotal}
                                            onChange={this.handleChangeCalendarRuleLastTotal} 
                                        />
                                        <select
                                            name="calendar-rule-last-time-format-dropdown"
                                            value={this.state.calendarOptionCalendarRule.lastTimeFormat}
                                            onChange={this.handleChangeCalendarRuleLastTimeFormat}
                                        >
                                            <option value="Hours">Hours</option>
                                            <option value="Days">Days</option>
                                            <option value="Weeks">Weeks</option>
                                        </select>
                                    </div>
                                </div> 
                            )}
                        </div> 
                    </div>
                    <div className="lot-selection-display-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px",  display:"block"}}>
                                * No selection meaning default is "ALL"
                        </span>
                        <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px",  display:"block"}}>
                                * Calendar start date should be earlier than end date.
                        </span>

                        <Button 
                            className="lot-selection-display-get-lot-id" 
                            size="small" 
                            variant="contained"  
                            value="load"
                            color="default"
                            style={{
                                marginTop:"10px",
                                marginLeft:"160px",
                            }}
                            onClick = {this.handleClickGetLotId}
                        >
                            Get Lot ID
                        </Button>
                        <div className="lot-selection-display-container-summary">
                            {this.state.technologySelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"10px",  display:"block"}}>
                                    TECHNOLOGY:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.technologySelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.dataTypeSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    DATA TYPE:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.dataTypeSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.mfgAreaSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    MFG AREA:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.mfgAreaSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.productFamilySelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    PRODUCT FAMILY:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.productFamilySelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.productSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    PRODUCT:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.productSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.lotTypeSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    LOT TYPE:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.lotTypeSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.projectSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    PROJECT:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.projectSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.mcnSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    MCN:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.mcnSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.partIdMaskSetSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    PART ID MASK SET:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.partIdMaskSetSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.partIdSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    PART ID:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.partIdSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.processAreaSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    PROCESS AREA:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.processAreaSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.operationSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    OPERATION:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.operationSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.subOperationSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    SUB OPERATION:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.subOperationSelectedValueDisplay}
                                    </span>
                                </span>
                            )}
                            {this.state.equipmentSelectedValueDisplay.length === 0 ? "": (
                                <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "10px", marginTop:"5px", display:"block"}}>
                                    EQUIPMENT:
                                    <span style={{fontSize: "12px", fontWeight: "normal", fontFamily: "Verdana", display:"block", width:"100%", marginTop:"2px"}}>
                                        {this.state.equipmentSelectedValueDisplay}
                                    </span>
                                </span>
                            )}

                            <div style={{ fontSize: "12px", fontFamily: "Verdana", marginLeft: "10px", marginTop:"30px", display:"block"}}>
                                <p style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>CALENDAR: <span style={{ fontSize: "13px", fontWeight: "normal"}}>{this.state.calendarOption}</span></p>
                                    {/* Date Selected */}
                                    {this.state.calendarOption === 'Date' && (
                                        <div>
                                            <p>
                                                Start Date:
                                                <span style={{ marginLeft: "16px"}}>
                                                    {this.state.calendarOptionDate.startDate.length > 0 && 
                                                    ((this.state.calendarOptionDate.startDate[1] < 10 ? `0${this.state.calendarOptionDate.startDate[1]}` : `${this.state.calendarOptionDate.startDate[1]}`) + '/' +
                                                    (this.state.calendarOptionDate.startDate[2] < 10 ? `0${this.state.calendarOptionDate.startDate[2]}` : `${this.state.calendarOptionDate.startDate[2]}`) + '/' +
                                                    this.state.calendarOptionDate.startDate[0])}
                                                </span>
                                            </p>
                                            <p>
                                                Start Time:
                                                <span style={{ marginLeft: "16px"}}>
                                                    {this.state.calendarOptionDate.startTime.length > 0 && 
                                                    ((this.state.calendarOptionDate.startTime[0] < 13 ? `${this.state.calendarOptionDate.startTime[0]}` : `${this.state.calendarOptionDate.startTime[0] - 12}`) + ':' +
                                                    (this.state.calendarOptionDate.startTime[1] < 10 ? `0${this.state.calendarOptionDate.startTime[1]}` : `${this.state.calendarOptionDate.startTime[1]}`) +
                                                    (this.state.calendarOptionDate.startTime[0] < 12 ? ' AM' : ' PM'))}
                                                </span>
                                            </p>
                                            <br/>
                                            <p>
                                                End Date:
                                                <span style={{ marginLeft: "22px"}}>
                                                    {this.state.calendarOptionDate.endDate.length > 0 && 
                                                    ((this.state.calendarOptionDate.endDate[1] < 10 ? `0${this.state.calendarOptionDate.endDate[1]}` : `${this.state.calendarOptionDate.endDate[1]}`) + '/' +
                                                    (this.state.calendarOptionDate.endDate[2] < 10 ? `0${this.state.calendarOptionDate.endDate[2]}` : `${this.state.calendarOptionDate.endDate[2]}`) + '/' +
                                                    this.state.calendarOptionDate.endDate[0])}
                                                </span>
                                            </p>
                                            <p>
                                                End Time:
                                                <span style={{ marginLeft: "22px"}}>
                                                    {this.state.calendarOptionDate.endTime.length > 0 && 
                                                    ((this.state.calendarOptionDate.endTime[0] < 13 ? `${this.state.calendarOptionDate.endTime[0]}` : `${this.state.calendarOptionDate.endTime[0] - 12}`) + ':' +
                                                    (this.state.calendarOptionDate.endTime[1] < 10 ? `0${this.state.calendarOptionDate.endTime[1]}` : `${this.state.calendarOptionDate.endTime[1]}`) +
                                                    (this.state.calendarOptionDate.endTime[0] < 12 ? ' AM' : ' PM'))}
                                                </span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Last n Days/Lots Selected */}
                                    {this.state.calendarOption === 'Last n Days/Lots' && (
                                        <div>
                                            {this.state.calendarOptionLastNDaysLots.radioButton === 'Last Days' && (
                                                <span>Last {this.state.calendarOptionLastNDaysLots.lastDaysTotal} {(this.state.calendarOptionLastNDaysLots.lastDaysTotal === 1 ? 'Day' : 'Days')}</span>
                                            )}
                                            {this.state.calendarOptionLastNDaysLots.radioButton === 'Last Lots' && (
                                                <span>Last {this.state.calendarOptionLastNDaysLots.lastLotsTotal} {(this.state.calendarOptionLastNDaysLots.lastLotsTotal === 1 ? 'Lot' : 'Lots')}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Calendar Rule */}
                                    {this.state.calendarOption === 'Calendar Rule' && (
                                        <div>
                                            {this.state.calendarOptionCalendarRule.radioButton === 'Period' && (
                                                <div>
                                                    <p><span style={{marginRight: "10px"}}>Period:</span>{this.state.calendarOptionCalendarRule.periodTimeFormat}</p>
                                                    <p><span style={{marginRight: "16px"}}>Start:</span>{this.state.calendarOptionCalendarRule.periodTimeStart}</p>
                                                    <p><span style={{marginRight: "24px"}}>End:</span>{this.state.calendarOptionCalendarRule.periodTimeEnd}</p>
                                                </div>
                                            )}
                                            {this.state.calendarOptionCalendarRule.radioButton === 'Last' && (
                                                <div>
                                                    <span style={{ marginRight: "40px" }}>Last {this.state.calendarOptionCalendarRule.lastTimeFormat}: {this.state.calendarOptionCalendarRule.lastTotal} </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className ="lot-selection-id-filter-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft:"5px", marginTop:"5px", display:"block"}}>
                            please filtering the Lot id here:
                        </span>
                        <div className="lot-selection-id-filter-container-box">
                            <DualListBox
                                className="lot-selection-id-filter-container-list-box"
                                canFilter
                                options={this.state.lotIdContainerOptions}
                                selected={this.state.lotIdContainerSelectedValue}
                                onChange={this.handleChangeLotIdContainer}
                            />
                        </div>
                    </div>
                    <div className ="lot-selection-data-retrieval-container">
                        <span style={{ fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", textAlign: "center" }}>
                             Data Retrieval
                        </span>
                        <div className="lot-selection-data-retrieval-aggregation-level-container">
                            <p style={{fontSize: "12px", marginBottom: "5px", fontFamily: "Verdana", fontWeight: "bold" }}>Aggregation Level</p>
                            <input 
                                type="radio" 
                                name="aggregation-level-radio-button" 
                                value="aggregation-level-lot-radio-button"
                                id="aggregation-level-lot-radio-button"
                                defaultChecked 
                                onClick={this.handleClickAggregationLevelLotRadioButton} 
                            />
                            <label>Lot</label>

                            <input 
                                type="radio" 
                                name="aggregation-level-radio-button" 
                                value="aggregation-level-wafer-radio-button"
                                id="aggregation-level-wafer-radio-button"
                                onClick={this.handleClickAggregationLevelWaferRadioButton} 
                            />
                            <label>Wafer</label>

                            <input 
                                type="radio" 
                                name="aggregation-level-radio-button" 
                                value="aggregation-level-unit-radio-button"
                                id="aggregation-level-unit-radio-button"
                                onClick={this.handleClickAggregationLevelUnitRadioButton}
                            />
                            <label>Unit</label>

                            <input 
                                type="checkbox" 
                                name="aggregation-level-check-box" 
                                value="aggregation-level-extra-check-box"
                                id="aggregation-level-extra-check-box"
                                onClick={this.handleClickAggregationLevelExtraCheckBox}
                                disabled 
                            />
                            <label>Extra</label>
                        </div>

                        <div className="lot-selection-data-retrieval-retrieve-parameter-by-container">
                            <p style={{fontSize: "12px", marginBottom: "5px", fontFamily: "Verdana", fontWeight: "bold" }}>Retrieve Parameter By</p>
                            <input 
                                type="radio" 
                                name="retrieve-parameter-by-radio-button" 
                                value="retrieve-parameter-by-none-radio-button"
                                id="retrieve-parameter-by-none-radio-button"
                                onClick={this.handleClickRetrieveParameterByNoneRadioButton} 
                                disabled 
                            />
                            <label>None</label>

                            <input 
                                type="radio" 
                                name="retrieve-parameter-by-radio-button" 
                                value="retrieve-parameter-by-product-radio-button"
                                id="retrieve-parameter-by-product-radio-button"
                                onClick={this.handleClickRetrieveParameterByProductRadioButton} 
                            />
                            <label>Product</label>

                            <input 
                                type="radio" 
                                name="retrieve-parameter-by-radio-button" 
                                value="retrieve-parameter-by-lot-radio-button"
                                id="retrieve-parameter-by-lot-radio-button"
                                defaultChecked 
                                onClick={this.handleClickRetrieveParameterByLotRadioButton}
                            />
                            <label>Lot</label>
                        </div>

                        <div className="lot-selection-data-retrieval-type-container">
                            <p style={{fontSize: "12px", marginBottom: "5px", marginLeft: "5px", fontFamily: "Verdana", fontWeight: "bold" }}> Data Type</p>
                            <div className="lot-selection-data-retrieval-type-options-container">
                                <ul id="dataTypeList">
                                    {Object.keys(this.state.dataTypeListDisplay).map((key, index)=>(
                                        this.state.dataTypeListDisplay[key] === "disabled" ?(
                                            <li key={`${key}`}>
                                                <input
                                                    type="checkbox" 
                                                    name="type-check-box" 
                                                    value={`${key}`}
                                                    onChange={this.handleClickDataTypeCheckBox}
                                                    disabled 
                                                />
                                                <label>{`${key}`}</label>
                                            </li>
                                        ):(
                                            <li key={`${key}`}>
                                                <input
                                                    type="checkbox" 
                                                    name="type-check-box" 
                                                    value={`${key}`}
                                                    onChange={this.handleClickDataTypeCheckBox} 
                                                />
                                                <label>{`${key}`}</label>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className ="lot-selection-parameter-filter-container">
                        <span style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Verdana", marginLeft:"5px", marginTop:"5px", display:"block"}}>
                            Parameters Filter
                        </span>
                        <div className="lot-selection-parameter-container-box">
                            <div className = "lot-selection-parameter-container-box-top">
                                {this.state.dataRetrievalTypes.map((value)=>(
                                    <button 
                                        key={`${value}`} 
                                        type="button" 
                                        style={{marginRight:"5px", marginTop:"5px"}} 
                                        onClick={self.handleClickDataTypeToRetrieveParameter.bind(self,value)}
                                    >
                                        {`${value}`}
                                    </button>   
                                ))}
                            </div>
                            <div className = "lot-selection-parameter-container-box-middle">
                                {this.state.dataRetrievalTypeClicked === "WIP" ? 
                                    (<div className = "lot-selection-parameter-container-box-middle-container">
                                        <span style={{fontSize: "12px", textAlign: "center", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "5px", marginTop:"5px", display:"block"}}>
                                            WIP
                                        </span>
                                        <span style={{fontSize: "12px", textAlign: "left", fontFamily: "Verdana", left: "5px", top:"16px", display:"block", position:"absolute"}}>
                                            Available Operations:
                                        </span>
                                        <select 
                                            className = "lot-selection-parameter-container-box-middle-container-selection-WIP-available-operation" 
                                            name = "WIP_available_operation" 
                                            multiple
                                        >
                                            {this.state.dataRetrievalWIPOperationMenuList.map((data)=>(
                                                <option 
                                                    key={`${data["value"]}`} 
                                                    value={`${data["value"]}`} 
                                                >
                                                    {`${data["value"]}`}
                                                </option>   
                                            ))}
                                        </select>
                                        <input
                                            className = "lot-selection-parameter-container-box-middle-container-checkbox" 
                                            type="checkbox" 
                                            name="sub-operation-check-box"
                                            id="sub-operation-check-box" 
                                            onClick={self.handleClickUseSubOperations.bind(self)} 
                                        />
                                        <label style={{fontSize: "12px", fontFamily: "Verdana", left: "25px", top:"79px", position:"absolute"}}>Sub Operations</label>
                                        <span style={{fontSize: "12px", textAlign: "left", fontFamily: "Verdana", left: "5px", top:"100px", display:"block", position:"absolute"}}>
                                            Operations:
                                        </span>
                                        <DualListBox
                                            className="lot-selection-parameter-container-box-middle-container-WIP-list-box"
                                            options={this.state.parameterContainerOptions}
                                            selected={this.state.parameterContainerWIPSelectedValue}
                                            onChange={this.handleChangeWIPParameterContainer}
                                        />
                                    </div>)
                                :""}
                                {this.state.dataRetrievalTypeClicked === "WP" ? 
                                    (<div className = "lot-selection-parameter-container-box-middle-container">
                                        <span style={{fontSize: "12px", textAlign: "center", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "5px", marginTop:"5px", display:"block"}}>
                                            WP
                                        </span>
                                        <span style={{fontSize: "12px", textAlign: "left", fontFamily: "Verdana", left: "5px", top:"20px", display:"block", position:"absolute"}}>
                                            Operation:
                                        </span>
                                        <select 
                                            className = "lot-selection-parameter-container-box-middle-container-selection-WP-operation" 
                                            name = "WP_operation"
                                            onChange={this.handleChangeDataTypeWPOperation}
                                        >
                                            {this.state.dataRetrievalWPOperationMenuList.map((data)=>(
                                                <option 
                                                    key={`${data["value"]}`} 
                                                    value={`${data["value"]}`} 
                                                >
                                                    {`${data["value"]}`}
                                                </option>   
                                            ))}
                                        </select>
                                        <DualListBox
                                            className="lot-selection-parameter-container-box-middle-container-WP-list-box"
                                            options={this.state.parameterContainerOptions}
                                            selected={this.state.parameterContainerWPSelectedValue}
                                            onChange={this.handleChangeWPParameterContainer}
                                        />
                                    </div>)
                                :""}
                                {this.state.dataRetrievalTypeClicked === "PCM" ? 
                                    (<div className = "lot-selection-parameter-container-box-middle-container">
                                        <span style={{fontSize: "12px", textAlign: "center", fontWeight: "bold", fontFamily: "Verdana", marginLeft: "5px", marginTop:"5px", display:"block"}}>
                                            PCM
                                        </span>
                                        <span style={{fontSize: "12px", textAlign: "left", fontFamily: "Verdana", left: "5px", top:"20px", display:"block", position:"absolute"}}>
                                            Operation:
                                        </span>
                                        <select 
                                            className = "lot-selection-parameter-container-box-middle-container-selection-PCM-operation" 
                                            name = "PCM_operation"
                                            onChange={this.handleChangeDataTypePCMOperation}
                                        >
                                            {this.state.dataRetrievalPCMOperationMenuList.map((data)=>(
                                                <option 
                                                    key={`${data["value"]}`} 
                                                    value={`${data["value"]}`} 
                                                >
                                                    {`${data["value"]}`}
                                                </option>   
                                            ))}
                                        </select>
                                        <DualListBox
                                            className="lot-selection-parameter-container-box-middle-container-PCM-list-box"
                                            options={this.state.parameterContainerOptions}
                                            selected={this.state.parameterContainerPCMSelectedValue}
                                            onChange={this.handleChangePCMParameterContainer}
                                        />
                                    </div>)
                                :""}
                            </div>
                            <div className = "lot-selection-parameter-container-box-bottom">
                                <Button 
                                    className="lot-selection-parameter-container-box-bottom-submit" 
                                    size="small" 
                                    variant="contained"  
                                    value="load"
                                    color="default"
                                    style={{
                                        marginTop:"2px",
                                        marginLeft:"5px",
                                    }}
                                    onClick = {this.handleClickSubmitAllParameters}
                                >
                                    Run
                                </Button>
                                <Button 
                                    className="lot-selection-parameter-container-box-bottom-submit" 
                                    size="small" 
                                    variant="contained"  
                                    value="load"
                                    color="default"
                                    style={{
                                        marginTop:"2px",
                                        marginLeft:"5px",
                                    }}
                                    onClick = {this.handleClickSubmitAllParameters}
                                >
                                    Preference
                                </Button>
                                <Button 
                                    className="lot-selection-parameter-container-box-bottom-submit" 
                                    size="small" 
                                    variant="contained"  
                                    value="load"
                                    color="default"
                                    style={{
                                        marginTop:"2px",
                                        marginLeft:"5px",
                                    }}
                                    onClick = {this.handleClickSubmitAllParameters}
                                >
                                    Load
                                </Button>
                                <Button 
                                    className="lot-selection-parameter-container-box-bottom-submit" 
                                    size="small" 
                                    variant="contained"  
                                    value="load"
                                    color="default"
                                    style={{
                                        marginTop:"2px",
                                        marginLeft:"5px",
                                    }}
                                    onClick = {this.handleClickSubmitAllParameters}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
