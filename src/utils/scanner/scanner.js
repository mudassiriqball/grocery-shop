
import React, { Component } from 'react';
import Quagga from 'quagga';
import { Button, Col, Modal, Row } from "react-bootstrap";
import Scan from "./scan";

class Scanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            scanCode: '',
            modal: false,
            scanSuccess: false
        }
        this._onDetected = this._onDetected.bind(this);
        this._toggle = this._toggle.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    componentDidMount() {
        document.querySelector("#inputId").addEventListener("change", this.handleFileSelect, false);
    }

    componentWillUnmount() {
        document.querySelector("#inputId").removeEventListener("change", this.handleFileSelect, false);
    }

    handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var tmpImgURL = URL.createObjectURL(files[0]);
        const current = this;
        Quagga.decodeSingle(
            {
                src: tmpImgURL,
                numOfWorkers: 0, // Needs to be 0 when used within node
                locate: true,
                inputStream: {
                    size: 800 // restrict input-size to be 800px in width (long-side)
                },
                decoder: {
                    readers: [
                        "code_128_reader",
                        "ean_reader",
                        "ean_8_reader",
                        "code_39_reader",
                        "code_39_vin_reader",
                        "codabar_reader",
                        "upc_reader",
                        "upc_e_reader",
                        "i2of5_reader"
                    ]
                }
            },
            function (result) {
                console.log(result);
                if (result) {
                    if (result.codeResult != null) {
                        current.props.setScanerCode(result.codeResult.code);
                        current.setState({ results: result })
                    } else {
                        alert("not detected");
                    }
                } else {
                    alert("not detected");
                }
            }
        );
    }

    _toggle() {
        this.setState(prevState => ({ modal: !prevState.modal }));
    }

    _onDetected(result) {
        this.props.setScanerCode(result.codeResult.code)
        this.setState({
            modal: false,
            // scanCode: result ? result.codeResult.code : '',
            // scanSuccess: result ? true : false,
            result: result
        });
    }

    render() {
        return (
            <Row>
                <Col>
                    <Button variant="primary" size={this.props.small ? 'sm' : 'lg'} block onClick={this._toggle}>
                        {'Scan Barcode'}
                    </Button>
                </Col>
                <Col>
                    <input id="inputId" type="file" accept="image/*" />
                </Col>
                <Modal show={this.state.modal} onHide={this._toggle}>
                    <Modal.Header closeButton="true" />
                    <Modal.Body>
                        <Scan handleScan={this._onDetected} />
                    </Modal.Body>
                </Modal>
            </Row>
        );
    }
}

export default Scanner;