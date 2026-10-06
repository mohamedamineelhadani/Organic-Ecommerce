<?php

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Product.php';

class ProductController extends BaseController {
    private $productModel;

    public function __construct() {
        $this->productModel = new Product();
    }

    public function getAll() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        try {
            $filters = array_filter([
                'category' => $_GET['category'] ?? null,
                'search'   => $_GET['search']   ?? null,
                'sort'     => $_GET['sort']     ?? null,
                'limit'    => $_GET['limit']    ?? null,
            ], fn($v) => $v !== null && $v !== '');

            $products = $this->productModel->getAll($filters);
            $this->sendSuccess(array_map([$this, 'formatProduct'], $products));

        } catch (Exception $e) {
            $this->sendError('Failed to fetch products: ' . $e->getMessage(), 500);
        }
    }

    public function getById() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->sendError('Product ID is required', 400);
        }

        try {
            $product = $this->productModel->findById($id);
            if (!$product) {
                $this->sendError('Product not found', 404);
            }

            $this->sendSuccess($this->formatProduct($product));

        } catch (Exception $e) {
            $this->sendError('Failed to fetch product: ' . $e->getMessage(), 500);
        }
    }

    public function getCategories() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->sendError('Method not allowed', 405);
        }

        try {
            $categories = $this->productModel->getCategories();
            $this->sendSuccess($categories);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch categories: ' . $e->getMessage(), 500);
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('Method not allowed', 405);
        }

        $data = $this->getRequestData();
        $this->validateRequired($data, ['name', 'price']);

        try {
            $productId = $this->productModel->create($data);
            $product   = $this->productModel->findById($productId);

            $this->sendSuccess($this->formatProduct($product), 'Product created successfully', 201);
        } catch (Exception $e) {
            $this->sendError('Failed to create product: ' . $e->getMessage(), 500);
        }
    }

    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->sendError('Method not allowed', 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->sendError('Product ID is required', 400);
        }

        $data = $this->getRequestData();

        try {
            $this->productModel->update($id, $data);
            $product = $this->productModel->findById($id);
            $this->sendSuccess($this->formatProduct($product), 'Product updated successfully');
        } catch (Exception $e) {
            $this->sendError('Failed to update product: ' . $e->getMessage(), 500);
        }
    }

    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->sendError('Method not allowed', 405);
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            $this->sendError('Product ID is required', 400);
        }

        try {
            $this->productModel->delete($id);
            $this->sendSuccess(null, 'Product deleted successfully');
        } catch (Exception $e) {
            $this->sendError('Failed to delete product: ' . $e->getMessage(), 500);
        }
    }

    private function formatProduct($product) {
        return [
            'id'             => (int)$product['id'],
            'name'           => $product['name'],
            'description'    => $product['description'],
            'price'          => (float)$product['price'],
            'pricing_unit'   => $product['pricing_unit'],
            'quantity_stock' => (int)$product['quantity_stock'],
            'category'       => $product['category_name'] ?? null,
            'image'          => $product['image'],
            'origin'         => $product['origin'],
            'season'         => $product['season'],
            'nutrients'      => $product['nutrients'],
            'shelfLife'      => $product['shelf_life'],
        ];
    }
}