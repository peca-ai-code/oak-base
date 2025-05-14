// src/components/auth/Login.js

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Alert, Button, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { login, error, setError } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError(null);
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      setLoginError(err.response?.data?.error_description || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card>
          <Card.Header className="text-center">
            <h2>Login</h2>
          </Card.Header>
          <Card.Body>
            {(loginError || error) && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {loginError || error}
              </Alert>
            )}
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
          <Card.Footer className="text-center">
            <p className="mb-0">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;