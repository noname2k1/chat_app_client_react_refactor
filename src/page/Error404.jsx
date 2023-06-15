import React from 'react';
import { Col, Row } from 'antd';
import './Error404.scss';
import { Link } from 'react-router-dom';
const Error404 = () => {
    return (
        <section className='page_404'>
            <div className='container'>
                <Row>
                    <Col xs={24} sm={24} md={24}>
                        <div className='four_zero_four_bg'>
                            <h1 className='text-center '>404</h1>
                        </div>
                        <div className='contant_box_404'>
                            <h3 className='h2'>Look like you're lost</h3>
                            <p>the page you are looking for not avaible!</p>
                            <Link to='/' className='link_404'>
                                Go to Home
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default Error404;
