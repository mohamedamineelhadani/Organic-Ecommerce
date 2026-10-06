<?php

require_once __DIR__ . '/../config/Config.php';

class BaseController {


    protected function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    protected function sendError($message, $statusCode = 400) {
        $this->sendResponse([
            'success' => false,
            'message' => $message
        ], $statusCode);
    }

    protected function sendSuccess($data = null, $message = 'Success', $statusCode = 200) {
        $response = [
            'success' => true,
            'message' => $message
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        $this->sendResponse($response, $statusCode);
    }

    protected function getRequestData() {
        $raw  = file_get_contents('php://input');
        $json = json_decode($raw, true);
        return is_array($json) ? $json : $_POST;
    }

    protected function validateRequired($data, $fields) {
        $missing = [];
        foreach ($fields as $field) {
            if (empty($data[$field])) {
                $missing[] = $field;
            }
        }

        if (!empty($missing)) {
            $this->sendError('Missing required fields: ' . implode(', ', $missing), 422);
        }

        return true;
    }

    /**
     * Create signed token: base64(payload).hmac_signature
     */
    protected function generateToken($userId) {
        $payload = [
            'user_id' => $userId,
            'exp'     => time() + (7 * 24 * 60 * 60), // 7 days
        ];

        $data      = base64_encode(json_encode($payload));
        $signature = hash_hmac('sha256', $data, Config::JWT_SECRET);

        return $data . '.' . $signature;
    }

    /**
     * Read user id from signed Bearer token
     */
    protected function getUserId() {
        $headers = getallheaders();
        $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (empty($auth)) return null;

        if (!preg_match('/Bearer\s+(.+)/i', $auth, $m)) return null;

        $parts = explode('.', trim($m[1]));
        if (count($parts) !== 2) return null;

        [$data, $signature] = $parts;

        $expected = hash_hmac('sha256', $data, Config::JWT_SECRET);
        if (!hash_equals($expected, $signature)) return null;

        $payload = json_decode(base64_decode($data), true);
        if (!$payload || !isset($payload['user_id'])) return null;
        if (($payload['exp'] ?? 0) < time()) return null;

        return $payload['user_id'];
    }

    /**
     * Require auth and return user id, or fail 401
     */
    protected function requireAuth() {
        $userId = $this->getUserId();
        if (!$userId) {
            $this->sendError('Unauthorized', 401);
        }
        return $userId;
    }
}