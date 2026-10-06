<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Cart.php';

class CartController extends BaseController {
    private $cartModel;

    public function __construct() {
        $this->cartModel = new Cart();
    }

    public function getCart() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        $userId = $this->requireAuth();

        try {
            $cart = $this->cartModel->getCart($userId);
            $this->sendSuccess($cart);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch cart: ' . $e->getMessage(), 500);
        }
    }

    public function addItem() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('Method not allowed', 405);
        }

        $userId = $this->requireAuth();
        $data   = $this->getRequestData();
        $this->validateRequired($data, ['product_id']);

        $productId = (int)$data['product_id'];
        $quantity  = isset($data['quantity']) ? (int)$data['quantity'] : 1;

        if ($quantity < 1) {
            $this->sendError('Quantity must be at least 1', 400);
        }

        try {
            $this->cartModel->addItem($userId, $productId, $quantity);
            $cart = $this->cartModel->getCart($userId);
            $this->sendSuccess($cart, 'Item added to cart');
        } catch (Exception $e) {
            $this->sendError('Failed to add item: ' . $e->getMessage(), 500);
        }
    }

    public function updateQuantity() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->sendError('Method not allowed', 405);
        }

        $userId = $this->requireAuth();
        $data   = $this->getRequestData();
        $this->validateRequired($data, ['product_id', 'quantity']);

        $productId = (int)$data['product_id'];
        $quantity  = (int)$data['quantity'];

        try {
            $this->cartModel->updateQuantity($userId, $productId, $quantity);
            $cart = $this->cartModel->getCart($userId);
            $this->sendSuccess($cart, 'Cart updated');
        } catch (Exception $e) {
            $this->sendError('Failed to update cart: ' . $e->getMessage(), 500);
        }
    }

    public function removeItem() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->sendError('Method not allowed', 405);
        }

        $userId    = $this->requireAuth();
        $productId = $_GET['product_id'] ?? null;

        if (!$productId) {
            $this->sendError('Product ID is required', 400);
        }

        try {
            $this->cartModel->removeItem($userId, (int)$productId);
            $cart = $this->cartModel->getCart($userId);
            $this->sendSuccess($cart, 'Item removed from cart');
        } catch (Exception $e) {
            $this->sendError('Failed to remove item: ' . $e->getMessage(), 500);
        }
    }

    public function clearCart() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->sendError('Method not allowed', 405);
        }

        $userId = $this->requireAuth();

        try {
            $this->cartModel->clearCart($userId);
            $this->sendSuccess([], 'Cart cleared');
        } catch (Exception $e) {
            $this->sendError('Failed to clear cart: ' . $e->getMessage(), 500);
        }
    }
}