import React, {Component} from "react";
import {Col, Row, Button, Container} from "react-bootstrap";
import {browserHistory} from "react-router";

import '../App.css';
import {NotificationContainer, NotificationManager} from "react-notifications";

export default class Main extends Component {
    constructor(props) {
        super(props);
    }

    redirect(path) {
        browserHistory.push(path);
    };

    render() {
        let _this = this;
        return (
            <div className="text-center">
                <h2 className="mt-20">Manage Databases</h2>
                <div className="text-secondary pb-100">
                    Welcome to Database Management Console<br/>
                    You can manage databases, table,<br/>
                    add new tables, edit previous data
                </div>
                <div className="main">
                    <Container className="text-center">
                        <Row>
                            <Col sm={{span: 6}}>
                                <div className="main-action cursor-pointer" onClick={function () {
                                    _this.redirect(`/databases`)
                                }}>
                                    <Button>
                                        Manage Databases
                                    </Button>
                                    <div className="text-secondary mt-20">
                                        This allows you to edit existing databases, <br/>add tables, change data
                                    </div>
                                </div>
                            </Col>
                            <Col sm={{span: 6}}>
                                <div className="main-action cursor-pointer" onClick={function () {
                                    _this.redirect(`/database`)
                                }}>
                                    <Button>
                                        Add Database
                                    </Button>
                                    <div className="text-secondary mt-20">
                                        This allows you to add new database<br/>
                                        setting table and data inside
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <NotificationContainer/>
            </div>
        );
    }
}