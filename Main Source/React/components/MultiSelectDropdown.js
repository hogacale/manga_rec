import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import FormCheck from "react-bootstrap/FormCheck";
import {CloseButton, DropdownButton, Form, ListGroup, ListGroupItem} from "react-bootstrap";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";

export default class MultiSelectDropdown extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }
        let placement = true;
        this.handleOnCheckChange = this.handleOnCheckChange.bind(this);
        this.onUnselect = this.onUnselect.bind(this);
    }
    onUnselect(e){
        this.props.handleOnUnselect(e);
    }

    handleOnCheckChange(e,p){
        if(e._reactName !== "onChange") {
            this.props.onChange(e);
            return;
        }
        e.target.checked = this.props.selected[e.target.id];
        // console.log(this.props.selected);
    }

    render(){
        const rows = [];
        const text = [];
        let count = 0;
        let placement = true;
        this.props.list.forEach((item) => {
            rows.push(
                    <Dropdown.Item
                        show={this.state.show}
                        eventKey={count}
                        onClick={this.handleOnCheckChange}
                        id={count}
                    >
                        <input
                            key={Math.random()}
                            className={"me-2"}
                            type="checkbox"
                            checked={this.props.selected[count]}
                            id={count}
                            onChange={this.handleOnCheckChange}
                        />
                        {item}
                    </Dropdown.Item>
            )
            count++;
        })
        this.props.list.forEach((item, index) => {
            if(this.props.selected[index])
                text.push(
                    <ListGroup.Item hidden={!this.props.selected[index]}>
                        <div >
                            <CloseButton variant="red" onClick={this.onUnselect} className={"me-2"} id={index}/>
                            <p className={"text-truncate"}>{item}</p>
                        </div>
                    </ListGroup.Item>
                );
        });
        return(
            <div>
                <Dropdown className="d-inline mx-2" autoClose="outside">
                    <Dropdown.Toggle
                        id={this.props.type + "DropDown"}
                    >
                        {this.props.type}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <div style={{overflowY: 'scroll', maxHeight: "200px"}}>
                            {rows}
                        </div>

                    </Dropdown.Menu>
            </Dropdown>
                <div className={"closeList"}>
                    <ListGroup className={"list-group list-group-horizontal"} width="200px">
                        {text}
                    </ListGroup>
                    </div>
            </div>

        );
    }
}

class dropDownCheckbox extends React.Component{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        this.props.onCheckChange(e);
    }

    render() {
        return (
          <div>
              <FormCheck
                  label={this.props.label}
                  type={'checkbox'}
                  checked={this.props.selected}
              />
          </div>
        );
    }
}

class selectedList extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        const text = [];
        this.props.list.forEach((item, index) => {
            text.push(
                <p>{item}</p>
            )
        });
        return(
            <div>
                {text}
            </div>
        );
    }
}
