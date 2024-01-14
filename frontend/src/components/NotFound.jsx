import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaSadTear } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100 text-center " >
            <Row>
                <Col>
                    <FaSadTear className="not-found-icon" />
                    <h1 className="not-found-404">404</h1>
                    <p className="not-found-text">Page not found</p>
                    <Button className="not-found-btn" onClick={() => navigate('/')} >Back to Home</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default NotFoundPage;