// src/components/doctors/DoctorList.js

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';
import { Formik } from 'formik';
import * as Yup from 'yup';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/doctors/');
        setDoctors(response.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctor information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  const handleAppointmentClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };
  
  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedDoctor(null);
    
    // Reset appointment success after a delay
    if (appointmentSuccess) {
      setTimeout(() => {
        setAppointmentSuccess(false);
      }, 1000);
    }
  };
  
  const handleAppointmentSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await api.post('/api/appointments/', {
        doctor: selectedDoctor.id,
        appointment_time: values.appointmentTime,
        reason: values.reason,
        status: 'pending'
      });
      
      setAppointmentSuccess(true);
      resetForm();
      setTimeout(closeAppointmentModal, 2000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const validationSchema = Yup.object({
    appointmentTime: Yup.date()
      .required('Appointment time is required')
      .min(new Date(), 'Appointment time must be in the future'),
    reason: Yup.string()
      .required('Please provide a reason for the appointment')
      .min(10, 'Reason should be at least 10 characters')
  });
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="mb-4">Available Gynecologists</h3>
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      {doctors.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <h5>No doctors available</h5>
            <p>There are currently no gynecologists registered in our system.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {doctors.map(doctor => (
            <Col key={doctor.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Dr. {doctor.first_name} {doctor.last_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{doctor.specialization}</Card.Subtitle>
                  
                  <div className="mt-3 mb-2">
                    <strong>Qualifications:</strong> {doctor.qualification}
                  </div>
                  
                  <div className="mb-2">
                    <strong>Experience:</strong> {doctor.experience_years} years
                  </div>
                  
                  <Card.Text className="mt-3">{doctor.bio}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => handleAppointmentClick(doctor)}
                  >
                    Book Appointment
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Appointment Modal */}
      <Modal show={showAppointmentModal} onHide={closeAppointmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {appointmentSuccess ? 'Appointment Booked!' : 'Book an Appointment'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {appointmentSuccess ? (
            <Alert variant="success">
              Your appointment has been successfully booked. You'll receive a confirmation shortly.
            </Alert>
          ) : selectedDoctor && (
            <Formik
              initialValues={{
                appointmentTime: '',
                reason: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleAppointmentSubmit}
            >
              {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <p>
                      <strong>Doctor:</strong> Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                    </p>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Appointment Date & Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="appointmentTime"
                      value={values.appointmentTime}
                      onChange={handleChange}
                      isInvalid={touched.appointmentTime && !!errors.appointmentTime}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.appointmentTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Reason for Appointment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="reason"
                      value={values.reason}
                      onChange={handleChange}
                      isInvalid={touched.reason && !!errors.reason}
                      placeholder="Please briefly describe the reason for your appointment"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.reason}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={closeAppointmentModal} className="me-2">
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Booking...' : 'Book Appointment'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DoctorList;