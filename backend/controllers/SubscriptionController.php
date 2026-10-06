<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Subscription.php';

class SubscriptionController extends BaseController {
    private $subscriptionModel;

    public function __construct() {
        $this->subscriptionModel = new Subscription();
    }

    /**
     * POST /api/subscriptions
     * Body: { email }
     */
    public function subscribe() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('Method not allowed', 405);
        }

        $data = $this->getRequestData();
        $this->validateRequired($data, ['email']);

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendError('Invalid email format', 400);
        }

        try {
            $isNew = $this->subscriptionModel->subscribe($data['email']);

            if (!$isNew) {
                $this->sendSuccess(null, 'You are already subscribed!');
                return;
            }

            $this->sendSuccess(null, 'Successfully subscribed to our newsletter!', 201);

        } catch (Exception $e) {
            $this->sendError('Subscription failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/subscriptions  (admin only)
     */
    public function getAll() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        try {
            $subs = $this->subscriptionModel->findAll();
            $this->sendSuccess($subs);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch subscriptions: ' . $e->getMessage(), 500);
        }
    }
}