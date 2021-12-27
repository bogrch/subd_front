import axios from 'axios';
import React, {Component} from "react";
import {browserHistory} from "react-router";
import {Col, Row, Button, Dropdown,} from "react-bootstrap";
import {NotificationContainer, NotificationManager} from "react-notifications";
import 'react-notifications/lib/notifications.css';
import '../App.css';

import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";

export default class Database extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.params.id,
            database: {},
            isLoading: false,
        };
    }

    componentDidMount() {
        this.getDatabase();
    }

    getDatabase() {
        this.setState({isLoading: true});
        axios.get("http://localhost:8080/api/databases/" + this.state.id, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.data);
                this.setState({database: response.data, isLoading: false});
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    redirect(path) {
        browserHistory.push(path);
    };

    deleteTable(id) {
        axios.delete("http://localhost:8080/api/table?tableId=" + id, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                this.getDatabase();
                NotificationManager.success("Table deleted", "Success");
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    render() {
        let _this = this;
        let tables = this.state.database.tables ? this.state.database.tables : [];
        console.log(tables);
        return (
            <div className="Users">
                {this.state.isLoading ? <div className="application-loading"/> : null}
                <h2 className="text-center">Manage Tables in Database "{this.state.database.name}"</h2>
                <div className={"header-preview"}>
                    <Button className={"invite-agent"} onClick={function () {
                        _this.redirect(`/databases`)
                    }}>
                        Go to databases
                    </Button>
                    <Button className={"invite-agent ml-40"} onClick={function () {
                        _this.redirect(`/databases/${_this.state.id}/table`)
                    }}>
                        Add Table
                    </Button>
                </div>
                <br/>
                <Row className={"data-table"}>
                    <Col sm={{span: 11}} className={"user-table"}>
                        {this.state.isLoading ? <div className="application-loading"/>
                            :
                            <div>
                                <Row className="user-preview-header">
                                    <Col sm={{span: 2}}><b>Table name</b></Col>
                                    <Col sm={{span: 4}}><b>Attributes</b></Col>
                                    <Col sm={{span: 3}}><b>Lines</b></Col>
                                </Row>
                                {tables.map((table) => {
                                    return (
                                        <Row className="user-preview" key={"table" + table.id}>
                                            <Col sm={{span: 2}}>{table.name}</Col>
                                            <Col sm={{span: 4}}>{table.header.attributes.map(t => {
                                                return (
                                                    <div key={"headerAttibute" + t.id}>
                                                        {t.name + "(" + t.type + ", max=" + t.maxLength + ")" + " "}
                                                    </div>
                                                )
                                            })}</Col>
                                            {/*<Col sm={{span: 3}}>{agent.email}</Col>*/}
                                            <Col sm={{span: 3}}>{table.lines.length}</Col>
                                            <Col sm={{span: 3}}>
                                                <Dropdown className={"user-actions"}>
                                                    <DropdownToggle className={"user-actions-dropdown"} variant="outline-primary" id="dropdown-basic">
                                                        Actions
                                                    </DropdownToggle>

                                                    <DropdownMenu>
                                                        <Dropdown.Item onClick={function () {
                                                            _this.redirect("/databases/" + _this.state.id + "/tables/" + table.id);
                                                        }}>
                                                            View/Edit data
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={function () {
                                                            _this.deleteTable(table.id);
                                                        }}>
                                                            Delete table
                                                        </Dropdown.Item>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    );
                                })}
                                <Row className="empty-user-preview" key="empty-user-preview"/>
                            </div>
                        }
                    </Col>
                </Row>
                <NotificationContainer/>
            </div>
        )
    }
}