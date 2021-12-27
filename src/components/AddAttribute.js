import React, {Component} from "react";
import {Button, Col, Form, FormControl, FormGroup, Row} from "react-bootstrap";
import {browserHistory} from "react-router";
import axios from "axios";
import {NotificationContainer, NotificationManager} from "react-notifications";
import 'react-notifications/lib/notifications.css';

export default class AddTable extends Component {

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

        let firstName = this.user.firstName.value;
        let type = this.user.type.value;
        let maxLength = this.user.lastName.value;
        let errors = {};

        this.validateUser(errors, firstName, type, maxLength);

        if (Object.entries(errors).length === 0) {
            this.createUserRequest(firstName, type, maxLength);
        } else {
            this.setState({isLoading: false, errors: errors});
        }
    }

    validateUser(errors, firstName, type, maxLength) {
        if (!firstName) {
            errors["firstName"] = "This field is required"
        }
        let number = Number(maxLength);
        if (!maxLength) {
            errors["lastName"] = "This field is required"
        }
        if (isNaN(number) || number !== parseInt(number + "")) {
            console.log("not int " + maxLength);
            errors["lastName"] = "Insert integer";
        }

    }

    createUserRequest(firstName, type, maxLength) {
        if (type === "CHAR") {
            maxLength = 1;
        }
        let _this = this;
        this.setState({isLoading: true});
        axios.post(`https://subd-back.herokuapp.com/api/attribute?name=${firstName}&type=${type}&maxLength=${maxLength}&headerId=${_this.state.table.header.id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                _this.redirect(`/databases/${_this.state.databaseId}/tables/${_this.state.tableId}`);
                NotificationManager.success("Attribute added", "Success");
            })
            .catch(error => {
                console.log("Error *** : " + error);
            });
    }

    render() {
        let _this = this;
        return (
            <div className="AddUser">
                {this.state.isLoading ? <div className="application-loading"/> : null}
                <Col sm={{span: 8, offset: 2}} className="page-header">
                    <h2>Add Attribute</h2>
                </Col>
                <Col sm={{span: 8, offset: 2}} className={"page"}>
                    <Form>
                        <Row>
                            <Col sm={{span: 4}}>
                                <FormGroup controlId="formGroupFirstName">
                                    Attribute Name
                                    <FormControl ref={ref => {this.user.firstName = ref}} type="text"/>
                                    <span id="firstName-error" style={{color: "red"}}>{this.state.errors["firstName"]}</span>
                                </FormGroup>
                            </Col>
                            <Col sm={{span: 4}}>
                                <FormGroup controlId="formGroupHasNpn">
                                    Type
                                    <FormControl ref={ref => {this.user.type = ref}} as="select">
                                        <option>INTEGER</option>
                                        <option>REAL</option>
                                        <option>STRING</option>
                                        <option>CHAR</option>
                                        <option>COMPLEX_INTEGER</option>
                                        <option>COMPLEX_REAL</option>
                                    </FormControl>
                                </FormGroup>
                            </Col>
                            <Col sm={{span: 4}}>
                                <FormGroup controlId="formGroupLastName">
                                    Max Length
                                    <FormControl ref={ref => {this.user.lastName = ref}}  type="text"/>
                                    <span id="lastName-error" style={{color: "red"}}>{this.state.errors["lastName"]}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mt-40">
                            <Col sm={{span: 4, offset: 2}}>
                                <Button className="btn-secondary cancel" onClick={function() {_this.redirect(`/databases/${_this.state.databaseId}/tables/${_this.state.tableId}`)}}>Cancel</Button>
                            </Col>
                            <Col sm={{span: 4}}>
                                <Button className="save" size="large" onClick={function() {_this.createUser()}}>Add Attribute</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <NotificationContainer/>
            </div>
        );
    }
}
