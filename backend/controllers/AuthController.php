<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/User.php';

class AuthController extends BaseController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('Method not allowed', 405);
        }

        $data = $this->getRequestData();
        $this->validateRequired($data, ['full_name', 'email', 'password']);

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendError('Invalid email format', 400);
        }

        if (strlen($data['password']) < 6) {
            $this->sendError('Password must be at least 6 characters', 400);
        }

        if ($this->userModel->findByEmail($data['email'])) {
            $this->sendError('Email already registered', 409);
        }

        try {
            $userId = $this->userModel->create($data);
            $user   = $this->userModel->findById($userId);

            $this->sendSuccess([
                'user'  => $user,
                'token' => $this->generateToken($userId)
            ], 'Registration successful', 201);

        } catch (Exception $e) {
            $this->sendError('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('Method not allowed', 405);
        }

        $data = $this->getRequestData();
        $this->validateRequired($data, ['email', 'password']);

        try {
            $user = $this->userModel->verifyPassword($data['email'], $data['password']);

            if (!$user) {
                $this->sendError('Invalid email or password', 401);
            }

            $this->sendSuccess([
                'user'  => $user,
                'token' => $this->generateToken($user['id'])
            ], 'Login successful');

        } catch (Exception $e) {
            $this->sendError('Login failed: ' . $e->getMessage(), 500);
        }
    }

    public function getProfile() {
        $userId = $this->requireAuth();

        try {
            $user = $this->userModel->findById($userId);
            if (!$user) {
                $this->sendError('User not found', 404);
            }

            $this->sendSuccess($user);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch profile: ' . $e->getMessage(), 500);
        }
    }
}