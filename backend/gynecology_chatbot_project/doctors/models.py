# doctors/models.py

from django.db import models
from django.conf import settings


class DoctorProfile(models.Model):
    """
    Model to store doctor profiles
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_profile',
        limit_choices_to={'user_type': 'doctor'}
    )
    specialization = models.CharField(max_length=255)
    qualification = models.CharField(max_length=255)
    experience_years = models.PositiveSmallIntegerField()
    bio = models.TextField()
    availability = models.JSONField(default=dict)
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"


class Appointment(models.Model):
    """
    Model to store appointment requests
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments_as_patient',
        limit_choices_to={'user_type': 'patient'}
    )
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    appointment_time = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Appointment: {self.patient.username} with Dr. {self.doctor.user.last_name}"