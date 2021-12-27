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
            databaseId: props.params.id,
            id: null,
            errors: {}
        }
    }

    redirect(path) {
        browserHistory.push(path);
    };

    async createUser () {
        this.setState({isLoading: true});

        let firstName = this.user.firstName.value;
        let errors = {};

        this.validateUser(errors, firstName);

        if (Object.entries(errors).length === 0) {
            this.createUserRequest(firstName);
        } else {
            this.setState({isLoading: false, errors: errors});
        }
    }

    validateUser(errors, firstName) {
        if (!firstName) {
            errors["firstName"] = "This field is required"
        }
    }

    createUserRequest(firstName) {
        let _this = this;
        this.setState({isLoading: true});
        axios.post("https://subd-back.herokuapp.com/api/table?name=" + firstName + "&dbId=" + this.state.databaseId, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                _this.redirect(`/databases/${_this.state.databaseId}/tables/${response.data.id}`);
                NotificationManager.success("Table created", "Success");
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
                    <h2>Add Table</h2>
                </Col>
                <Col sm={{span: 8, offset: 2}} className={"page"}>
                    <Form>
                        <Row>
                            <Col sm={{span: 4}}>
                                <FormGroup controlId="formGroupFirstName">
                                    Table Name
                                    <FormControl ref={ref => {this.user.firstName = ref}} type="text"/>
                                    <span id="firstName-error" style={{color: "red"}}>{this.state.errors["firstName"]}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mt-40">
                            <Col sm={{span: 4, offset: 2}}>
                                <Button className="btn-secondary cancel" onClick={function() {_this.redirect(`/databases/${_this.state.databaseId}`)}}>Cancel</Button>
                            </Col>
                            <Col sm={{span: 4}}>
                                <Button className="save" size="large" onClick={function() {_this.createUser()}}>Create New Table</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <NotificationContainer/>
            </div>
        );
    }
}
