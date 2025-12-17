export const authSwaggerDocs = {
    register: {
        tags: ['Auth'],
        summary: 'Register new user',
        description: 'Register a new user account',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['username', 'password', 'email', 'fullName'],
                        properties: {
                            username: { type: 'string', example: 'johndoe' },
                            password: { type: 'string', example: 'Password123!' },
                            confirmPassword: { type: 'string', example: 'Password123!' },
                            email: { type: 'string', format: 'email', example: 'john@example.com' },
                            fullName: { type: 'string', example: 'John Doe' }
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'User registered successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'User registered successfully' },
                                data: {
                                    type: 'object',
                                    properties: {
                                        user: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string' },
                                                username: { type: 'string' },
                                                email: { type: 'string' },
                                                fullName: { type: 'string' },
                                                role: { type: 'string' },
                                                isActive: { type: 'boolean' }
                                            }
                                        },
                                        token: { type: 'string' },
                                        refreshToken: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            400: { description: 'Bad request - Validation error' }
        }
    },
    login: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Login with email and password',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password'],
                        properties: {
                            email: { type: 'string', format: 'email', example: 'john@example.com' },
                            password: { type: 'string', example: 'Password123!' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' }
        }
    },
    logout: {
        tags: ['Auth'],
        summary: 'Logout user',
        description: 'Logout current user',
        security: [{ bearerAuth: [] }],
        responses: {
            200: { description: 'Logout successful' }
        }
    },
    getCurrentUser: {
        tags: ['Auth'],
        summary: 'Get current user',
        description: 'Get current logged in user information',
        security: [{ bearerAuth: [] }],
        responses: {
            200: { description: 'User information retrieved' },
            401: { description: 'Unauthorized' }
        }
    },
    updateProfile: {
        tags: ['Auth'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            fullName: { type: 'string', example: 'John Doe Updated' },
                            phone: { type: 'string', example: '0123456789' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Profile updated successfully' }
        }
    },
    changePassword: {
        tags: ['Auth'],
        summary: 'Change password',
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        required: ['currentPassword', 'newPassword'],
                        properties: {
                            currentPassword: { type: 'string', example: 'OldPassword123!' },
                            newPassword: { type: 'string', example: 'NewPassword123!' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Password changed successfully' }
        }
    },
    forgotPassword: {
        tags: ['Auth'],
        summary: 'Forgot password',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        required: ['email'],
                        properties: {
                            email: { type: 'string', format: 'email', example: 'john@example.com' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Password reset email sent' }
        }
    },
    resetPassword: {
        tags: ['Auth'],
        summary: 'Reset password',
        parameters: [
            {
                in: 'path',
                name: 'token',
                required: true,
                schema: { type: 'string' },
                description: 'Password reset token'
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        required: ['password'],
                        properties: {
                            password: { type: 'string', example: 'NewPassword123!' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Password reset successfully' }
        }
    },
    refreshToken: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        required: ['refreshToken'],
                        properties: {
                            refreshToken: { type: 'string', example: 'refresh_token_here' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Token refreshed successfully' }
        }
    },
    verifyEmail: {
        tags: ['Auth'],
        summary: 'Verify email',
        parameters: [
            {
                in: 'path',
                name: 'token',
                required: true,
                schema: { type: 'string' },
                description: 'Email verification token'
            }
        ],
        responses: {
            200: { description: 'Email verified successfully' }
        }
    },
    resendVerification: {
        tags: ['Auth'],
        summary: 'Resend verification email',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        required: ['email'],
                        properties: {
                            email: { type: 'string', format: 'email', example: 'john@example.com' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Verification email sent' }
        }
    },
    checkEmail: {
        tags: ['Auth'],
        summary: 'Check if email exists',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        required: ['email'],
                        properties: {
                            email: { type: 'string', format: 'email', example: 'john@example.com' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Email check result' }
        }
    },
    checkUsername: {
        tags: ['Auth'],
        summary: 'Check if username exists',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        required: ['username'],
                        properties: {
                            username: { type: 'string', example: 'johndoe' }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Username check result' }
        }
    }
};