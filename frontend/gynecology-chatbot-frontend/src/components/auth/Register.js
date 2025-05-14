// src/components/auth/Register.js

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Alert, Button, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register, error, setError } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState(null);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    age: '',
    phone_number: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    first_name: Yup.string()
      .required('First name is required'),
    last_name: Yup.string()
      .required('Last name is required'),
    age: Yup.number()
      .typeError('Age must be a number')
      .positive('Age must be positive')
      .integer('Age must be an integer')
      .required('Age is required'),
    phone_number: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setRegisterError(null);
      
      // Remove confirmPassword as it's not needed for the API
      const { confirmPassword, ...userData } = values;
      
      await register(userData);
      navigate('/');
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = 'Registration failed. Please try again.';
      
      if (errorData) {
        // Format validation errors from Django
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('; ');
          
          if (errorMessages) {
            errorMessage = errorMessages;
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
      
      setRegisterError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <Card>
          <Card.Header className="text-center">
            <h2>Register</h2>
          </Card.Header>
          <Card.Body>
            {(registerError || error) && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {registerError || error}
              </Alert>
            )}
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Enter your email"
                        />
                        <ErrorMessage name="email" component="div" className="text-danger" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username *</label>
                        <Field
                          type="text"
                          id="username"
                          name="username"
                          className="form-control"
                          placeholder="Choose a username"
                        />
                        <ErrorMessage name="username" component="div" className="text-danger" />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">First Name *</label>
                        <Field
                          type="text"
                          id="first_name"
                          name="first_name"
                          className="form-control"
                          placeholder="Enter your first name"
                        />
                        <ErrorMessage name="first_name" component="div" className="text-danger" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name *</label>
                        <Field
                          type="text"
                          id="last_name"
                          name="last_name"
                          className="form-control"
                          placeholder="Enter your last name"
                        />
                        <ErrorMessage name="last_name" component="div" className="text-danger" />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="age" className="form-label">Age *</label>
                        <Field
                          type="number"
                          id="age"
                          name="age"
                          className="form-control"
                          placeholder="Enter your age"
                        />
                        <ErrorMessage name="age" component="div" className="text-danger" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="phone_number" className="form-label">Phone Number (Optional)</label>
                        <Field
                          type="text"
                          id="phone_number"
                          name="phone_number"
                          className="form-control"
                          placeholder="Enter your phone number"
                        />
                        <ErrorMessage name="phone_number" component="div" className="text-danger" />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          className="form-control"
                          placeholder="Enter your password"
                        />
                        <ErrorMessage name="password" component="div" className="text-danger" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                        <Field
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className="form-control"
                          placeholder="Confirm your password"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                      </div>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 mt-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
          <Card.Footer className="text-center">
            <p className="mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;