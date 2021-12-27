import React, {Component} from "react";
import {Button, Col, Form, FormControl, FormGroup, Row} from "react-bootstrap";
import {browserHistory} from "react-router";
import axios from "axios";
import {NotificationContainer, NotificationManager} from "react-notifications";
import 'react-notifications/lib/notifications.css';

export default class AddDatabase extends Component {

    constructor(props) {
        super(props);
        this.user = {};
        this.state = {
            id: null,
            errors: {}
        }
    }

    redirect(path) {
        browserHistory.push(path);
    };

    async createDb () {
        this.setState({isLoading: true});

        let firstName = this.user.firstName.value;
        let errors = {};

        this.validateName(errors, firstName);

        if (Object.entries(errors).length === 0) {
            this.createDbRequest(firstName);
        } else {
            this.setState({isLoading: false, errors: errors});
        }
    }

    validateName(errors, firstName) {
        if (!firstName) {
            errors["firstName"] = "This field is required"
        }
    }

    createDbRequest(firstName) {
        let _this = this;
        this.setState({isLoading: true});
        axios.post("https://subd-back.herokuapp.com/api/database?name=" + firstName, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                _this.redirect(`/databases/${response.data.id}`);
                NotificationManager.success("Database created", "Success");
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
                    <h2>Create Database</h2>
                </Col>
                <Col sm={{span: 8, offset: 2}} className={"page"}>
                    <Form>
                        <Row>
                            <Col sm={{span: 4}}>
                                <FormGroup controlId="formGroupFirstName">
                                    Database Name
                                    <FormControl ref={ref => {this.user.firstName = ref}} type="text"/>
                                    <span id="firstName-error" style={{color: "red"}}>{this.state.errors["firstName"]}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mt-40">
                            <Col sm={{span: 4, offset: 2}}>
                                <Button className="btn-secondary cancel" onClick={function() {_this.redirect("/databases")}}>Cancel</Button>
                            </Col>
                            <Col sm={{span: 4}}>
                                <Button className="save" size="large" onClick={function() {_this.createDb()}}>Create Database</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <NotificationContainer/>
            </div>
        );
    }
}
