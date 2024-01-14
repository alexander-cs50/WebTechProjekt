import React, {useState} from "react";
import {Col, Container, Offcanvas, Row} from "react-bootstrap";
import {RxHamburgerMenu} from "react-icons/rx";
import {FaDroplet, FaTemperatureHalf} from "react-icons/fa6";
import {FaHome} from "react-icons/fa";
import {MdOutlineGraphicEq} from "react-icons/md";
import {IoDocumentText} from "react-icons/io5";
import {Link} from 'react-router-dom';

const Layout = ({children}) => {
    const [show, setShow] = useState(false);
    const CloseCanvas = () => setShow(false);
    const ShowCanvas = () => setShow(true);

    return (
        <Container fluid style={{
            background: 'linear-gradient(180deg, rgba(17,42,55,1) 0%, rgba(24,49,63,1) 40%, rgba(33,81,95,1) 70%, rgba(42,113,140,1) 100%)',
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            minHeight: '100vh'
        }}>
            <Row style={{height: '75px'}}>
                <Col className='Navcol' style={{display: 'flex', alignItems: 'center', paddingLeft: '10px'}}>
                    <RxHamburgerMenu className='Hamburgermenu' onClick={ShowCanvas}></RxHamburgerMenu>
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                        <text className='appTitle'> Sensordata App
                        </text>
                    </Link>
                    {/* Offcanvas as navigation element */}
                    <Offcanvas show={show} onHide={CloseCanvas} style={{
                        background: 'black',
                        width: '18rem',
                        height: '100%',
                        display: 'flex',
                        color: 'lightgrey'
                    }}>
                        <Offcanvas.Header closeButton style={{marginBottom: '20px'}}>
                            <Offcanvas.Title>Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Container>
                                <Row className="mb-5 offcanvas-body-row">
                                    <Link to="/" style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                                        <Col className="d-flex align-items-center justify-content-start">
                                            <FaHome/>
                                            <text className="ms-3"> Home</text>
                                        </Col>
                                    </Link>
                                </Row>
                                <Row className="mb-5 offcanvas-body-row">
                                    <Link to="/Temperature"
                                          style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                                        <Col className="d-flex align-items-center justify-content-start">
                                            <FaTemperatureHalf/>
                                            <text className="ms-3"> Temperature</text>
                                        </Col>
                                    </Link>
                                </Row>
                                <Row className="mb-5 offcanvas-body-row">
                                    <Link to="/Humidity"
                                          style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                                        <Col className="d-flex align-items-center justify-content-start">
                                            <FaDroplet/>
                                            <text className="ms-3"> Humidity</text>
                                        </Col>
                                    </Link>
                                </Row>
                                <Row className="mb-5 offcanvas-body-row">
                                    <Link to="/Vibration"
                                          style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                                        <Col className="d-flex align-items-center justify-content-start">
                                            <MdOutlineGraphicEq/>
                                            <text className="ms-3"> Vibration</text>
                                        </Col>
                                    </Link>
                                </Row>
                                <Row className="mb-5 offcanvas-body-row">
                                    <Link to="/Documentation"
                                          style={{textDecoration: 'none', color: 'inherit', width: '100%'}}>
                                        <Col className="d-flex align-items-center justify-content-start">
                                            <IoDocumentText/>
                                            <text className="ms-3"> Documentation</text>
                                        </Col>
                                    </Link>
                                </Row>
                            </Container>
                        </Offcanvas.Body>
                    </Offcanvas>
                </Col>
            </Row>
            {/* content of the children element */}
            {children}
        </Container>
    );
};

export default Layout;