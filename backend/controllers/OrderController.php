<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/Cart.php';
require_once __DIR__ . '/../config/Config.php';

class OrderController extends BaseController {
    private $orderModel;
    private $cartModel;

    public function __construct() {
        $this->orderModel = new Order();
        $this->cartModel  = new Cart();
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('Method not allowed', 405);
        }

        $data = $this->getRequestData();
        $this->validateRequired($data, [
            'full_name', 'email', 'phone',
            'shipping_address', 'city', 'zip_code', 'items'
        ]);

        if (empty($data['items']) || !is_array($data['items'])) {
            $this->sendError('Order items are required', 400);
        }

        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->sendError('Invalid email format', 400);
        }

        // Calculate totals
        $subtotal = 0;
        foreach ($data['items'] as $item) {
            if (!isset($item['price'], $item['quantity'], $item['id'], $item['name'])) {
                $this->sendError('Each item requires id, name, price, quantity', 400);
            }
            $subtotal += (float)$item['price'] * (int)$item['quantity'];
        }

        $tax       = round($subtotal * Config::TAX_RATE, 2);
        $shipping  = $subtotal >= Config::FREE_SHIPPING_THRESHOLD ? 0 : Config::SHIPPING_COST;
        $codFee    = ($data['payment_method'] ?? 'online') === 'cod' ? Config::COD_FEE : 0;
        $total     = round($subtotal + $tax + $shipping + $codFee, 2);

        $orderData = [
            'user_id'          => $this->getUserId(), // optional, can be null
            'full_name'        => $data['full_name'],
            'email'            => $data['email'],
            'phone'            => $data['phone'],
            'shipping_address' => $data['shipping_address'],
            'city'             => $data['city'],
            'state'            => $data['state'] ?? null,
            'zip_code'         => $data['zip_code'],
            'subtotal'         => $subtotal,
            'tax'              => $tax,
            'shipping'         => $shipping,
            'cod_fee'          => $codFee,
            'total'            => $total,
            'payment_method'   => $data['payment_method'] ?? 'online',
            'items'            => array_map(function ($item) {
                return [
                    'product_id'   => (int)$item['id'],
                    'product_name' => $item['name'],
                    'price'        => (float)$item['price'],
                    'quantity'     => (int)$item['quantity'],
                    'unit'         => $item['unit'] ?? 'lb',
                ];
            }, $data['items']),
        ];

        try {
            $order = $this->orderModel->create($orderData);

            // Clear cart if logged in
            if ($orderData['user_id']) {
                $this->cartModel->clearCart($orderData['user_id']);
            }

            $this->sendSuccess($order, 'Order placed successfully', 201);

        } catch (Exception $e) {
            $this->sendError('Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    public function getById() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->sendError('Order ID is required', 400);
        }

        try {
            $order = $this->orderModel->findById($id);
            if (!$order) {
                $this->sendError('Order not found', 404);
            }

            $order['items'] = $this->orderModel->getOrderItems($id);
            $this->sendSuccess($order);

        } catch (Exception $e) {
            $this->sendError('Failed to fetch order: ' . $e->getMessage(), 500);
        }
    }

    public function getByOrderNumber() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        $orderNumber = $_GET['order_number'] ?? null;
        if (!$orderNumber) {
            $this->sendError('Order number is required', 400);
        }

        try {
            $order = $this->orderModel->findByOrderNumber($orderNumber);
            if (!$order) {
                $this->sendError('Order not found', 404);
            }

            $order['items'] = $this->orderModel->getOrderItems($order['id']);
            $this->sendSuccess($order);

        } catch (Exception $e) {
            $this->sendError('Failed to fetch order: ' . $e->getMessage(), 500);
        }
    }

    public function getUserOrders() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        $userId = $this->requireAuth();

        try {
            $orders = $this->orderModel->findByUserId($userId);

            foreach ($orders as &$order) {
                $order['items'] = $this->orderModel->getOrderItems($order['id']);
            }

            $this->sendSuccess($orders);

        } catch (Exception $e) {
            $this->sendError('Failed to fetch orders: ' . $e->getMessage(), 500);
        }
    }
}