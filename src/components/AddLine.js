import React, {Component} from "react";
import {Button, Col, Form, FormControl, FormGroup, Row} from "react-bootstrap";
import {browserHistory} from "react-router";
import axios from "axios";
import {NotificationContainer, NotificationManager} from "react-notifications";
import 'react-notifications/lib/notifications.css';

export default class AddLine extends Component {

    constructor(props) {
        super(props);
        this.user = {};
        this.state = {
            table: {},
            tableId: props.params.tableId,
            databaseId: props.params.id,
            id: null,
            errors: {}
        }
    }

    getTable() {
        axios.get("https://subd-back.herokuapp.com/api/tables/" + this.state.tableId, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.data);
                this.setState({table: response.data});
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    componentDidMount() {
        this.getTable();
    }

    redirect(path) {
        browserHistory.push(path);
    };

    async createUser () {
        this.setState({isLoading: true});

        let errors = {};

        this.validateUser(errors, this.user);

        if (Object.entries(errors).length === 0) {
            this.createUserRequest(this.user);
        } else {
            this.setState({isLoading: false, errors: errors});
        }
    }

    validateUser(errors, values) {
        this.state.table.header.attributes.forEach(at => {
            let value = values[at.id].value;
            if (at.type === "CHAR") {
                if (!value) {
                    errors[at.id] = "This field is required"
                } else if (value.length !== 1) {
                    errors[at.id] = "Length for CHAR should be 1"
                }
            } else if (at.type === "INTEGER") {
                let number = Number(value);
                if (!value) {
                    errors[at.id] = "This field is required"
                }
                if (isNaN(number) || number !== parseInt(number + "")) {
                    errors[at.id] = "Insert integer";
                }
            } else if (at.type === "REAL") {
                let number = Number(value);
                if (!value) {
                    errors[at.id] = "This field is required"
                }
                if (isNaN(number)) {
                    errors[at.id] = "Insert real number";
                }
            } else if (at.type === "COMPLEX_REAL") {
                let nums = value.split(" ");
                if (nums.length !== 2) {
                    errors[at.id] = "Insert 2 real numbers"
                } else {
                    if (isNaN(nums[0]) || isNaN(nums[1])) {
                        errors[at.id] = "Insert 2 real numbers";
                    }
                }
            } else if (at.type === "COMPLEX_INTEGER") {
                let nums = value.split(" ");
                if (nums.length !== 2) {
                    errors[at.id] = "Insert 2 integer numbers"
                } else {
                    if (isNaN(nums[0]) || nums[0] != parseInt(nums[0] + "") || isNaN(nums[1]) || nums[1] != parseInt(nums[1] + "")) {
                        errors[at.id] = "Insert 2 integer numbers";
                    }
                }
            }
            if (!value) {
                errors[at.id] = "This field is required"
            } else if (value.length > at.maxLength) {
                errors[at.id] = "Too long"
            }
        })
        console.log(errors);
    }

    createUserRequest(values) {
        let _this = this;
        let body = [];
        this.state.table.header.attributes.forEach(at => {
            let name = at.name;
            let type = at.type;
            let value = values[at.id].value;
            body.push({
                name: name,
                type: type,
                value: value
            });
        });
        console.log(body);
        this.setState({isLoading: true});
        axios.post(`https://subd-back.herokuapp.com/api/line?tableId=${_this.state.table.id}`, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                _this.redirect(`/databases/${_this.state.databaseId}/tables/${_this.state.tableId}`);
                NotificationManager.success("Line added", "Success");
            })
            .catch(error => {
                console.log("Error *** : " + error);
            });
    }

    render() {
        let _this = this;
        let attributes = this.state.table.header ? this.state.table.header.attributes : [];
        return (
            <div className="AddUser">
                {this.state.isLoading ? <div className="application-loading"/> : null}
                <Col sm={{span: 8, offset: 2}} className="page-header">
                    <h2>Add Line</h2>
                </Col>
                <Col sm={{span: 8, offset: 2}} className={"page"}>
                    <Form>
                        {attributes.map(at => {
                            console.log(at);
                            return (
                                <Row key={"att" + at.id}>
                                    <Col sm={{span: 3}}>
                                        <FormGroup controlId={"formGroupName" + at.id}>
                                            Attribute Name
                                            <FormControl value={at.name} disabled />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={{span: 3}}>
                                        <FormGroup disabled controlId={"formGroupHasNpn" + at.id}>
                                            Type
                                            <FormControl value={at.type} disabled />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={{span: 3}}>
                                        <FormGroup controlId={"formGroupValue" + at.id}>
                                            Max Length
                                            <FormControl value={at.maxLength} disabled />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={{span: 3}}>
                                        <FormGroup controlId={"formGroupValue" + at.id}>
                                            Value
                                            <FormControl ref={ref => {
                                                this.user[at.id] = ref
                                            }} type="text"/>
                                            <span id={"value-error-" + at.id}
                                                  style={{color: "red"}}>{this.state.errors[at.id]}</span>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            );
                        })
                        }
                        <Row className="mt-40">
                            <Col sm={{span: 4, offset: 2}}>
                                <Button className="btn-secondary cancel" onClick={function() {_this.redirect(`/databases/${_this.state.databaseId}/tables/${_this.state.tableId}`)}}>Cancel</Button>
                            </Col>
                            <Col sm={{span: 4}}>
                                <Button className="save" size="large" onClick={function() {_this.createUser()}}>Add Line</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <NotificationContainer/>
            </div>
        );
    }
}
