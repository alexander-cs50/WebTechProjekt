import React from "react";
import Layout from './Layout'
import {Row, Col} from "react-bootstrap";

function Documentation() {

    const pdfPath = '/Anwenderdokumentation.pdf';


    return (
        <Layout>
            <Row style={{display: 'flex', flexGrow: '1', alignItems: 'center', margin: '40px'}}>
                <Col>
                    {/* Pdf Reader for user documentation */}
                    <div style={{
                        overflowY: 'auto',
                        height: '80vH',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        animation: 'slideDown 1s ease forwards'
                    }}>
                        <embed
                            src={pdfPath}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                        />
                    </div>
                </Col>
            </Row>
        </Layout>

    );
}

export default Documentation;