<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/ContactMessage.php';

class ContactController extends BaseController {
    private $contactModel;

    public function __construct() {
        $this->contactModel = new ContactMessage();
    }

    /**
     * POST /api/contact
     * Body: { email, subject?, message }
     */
    public function send() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('Method not allowed', 405);
        }

        $data = $this->getRequestData();
        $this->validateRequired($data, ['email', 'message']);

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendError('Invalid email format', 400);
        }

        if (strlen(trim($data['message'])) < 5) {
            $this->sendError('Message is too short', 400);
        }

        if (!empty($data['subject']) && strlen($data['subject']) > 200) {
            $this->sendError('Subject is too long (max 200 characters)', 400);
        }

        try {
            $id = $this->contactModel->create($data);
            $this->sendSuccess(['id' => $id], 'Message sent successfully. We will get back to you soon!', 201);

        } catch (Exception $e) {
            $this->sendError('Failed to send message: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/contact  (admin)
     */
    public function getAll() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        try {
            $messages = $this->contactModel->findAll();
            $this->sendSuccess($messages);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch messages: ' . $e->getMessage(), 500);
        }
    }
}