from enum import Enum


class UserRole(str, Enum):
    new_employee = 'new_employee'
    mentor = 'mentor'
    admin = 'admin'
