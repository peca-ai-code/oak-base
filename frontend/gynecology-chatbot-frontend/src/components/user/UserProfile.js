// src/components/user/UserProfile.js

import React, { useState, useContext } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const { currentUser, updateProfile, error: contextError } = useContext(AuthContext);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  
  const validationSchema = Yup.object({
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
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      
      await updateProfile(values);
      setUpdateSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = 'Profile update failed. Please try again.';
      
      if (errorData) {
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
      
      setUpdateError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!currentUser) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="warning">
            Please log in to view your profile.
          </Alert>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card>
      <Card.Header className="bg-white">
        <h3 className="mb-0">My Profile</h3>
      </Card.Header>
      
      <Card.Body>
        {(updateError || contextError) && (
          <Alert variant="danger" dismissible onClose={() => setUpdateError(null)}>
            {updateError || contextError}
          </Alert>
        )}
        
        {updateSuccess && (
          <Alert variant="success" dismissible onClose={() => setUpdateSuccess(false)}>
            Your profile has been updated successfully!
          </Alert>
        )}
        
        <Formik
          initialValues={{
            first_name: currentUser.first_name || '',
            last_name: currentUser.last_name || '',
            age: currentUser.age || '',
            phone_number: currentUser.phone_number || '',
            email: currentUser.email || '',
            username: currentUser.username || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      isInvalid={touched.first_name && !!errors.first_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={values.last_name}
                      onChange={handleChange}
                      isInvalid={touched.last_name && !!errors.last_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={values.username}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      Username cannot be changed.
                    </Form.Text>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={values.age}
                      onChange={handleChange}
                      isInvalid={touched.age && !!errors.age}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.age}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone_number"
                      value={values.phone_number}
                      onChange={handleChange}
                      isInvalid={touched.phone_number && !!errors.phone_number}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone_number}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default UserProfile;