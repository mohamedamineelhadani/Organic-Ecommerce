<?php

require_once __DIR__ . '/Model.php';

class Order extends Model {
    protected $table = "orders";

    public function create($data) {
        $orderNumber = "ORD-" . time() . "-" . rand(1000, 9999);

        $query = "INSERT INTO {$this->table} 
                  (user_id, order_number, full_name, email, phone, shipping_address, city, state, zip_code, 
                   subtotal, tax, shipping, cod_fee, total, payment_method) 
                  VALUES (:user_id, :order_number, :full_name, :email, :phone, :shipping_address, :city, :state, :zip_code, 
                          :subtotal, :tax, :shipping, :cod_fee, :total, :payment_method)";

        $params = [
            ':user_id'          => $data['user_id'] ?? null,
            ':order_number'     => $orderNumber,
            ':full_name'        => $data['full_name'],
            ':email'            => $data['email'],
            ':phone'            => $data['phone'],
            ':shipping_address' => $data['shipping_address'],
            ':city'             => $data['city'],
            ':state'            => $data['state'] ?? null,
            ':zip_code'         => $data['zip_code'],
            ':subtotal'         => $data['subtotal'],
            ':tax'              => $data['tax'],
            ':shipping'         => $data['shipping'],
            ':cod_fee'          => $data['cod_fee'] ?? 0,
            ':total'            => $data['total'],
            ':payment_method'   => $data['payment_method'] ?? 'online',
        ];

        $this->executeQuery($query, $params);
        $orderId = $this->conn->lastInsertId();

        if (!empty($data['items'])) {
            $this->createOrderItems($orderId, $data['items']);
        }

        return [
            'id'           => (int)$orderId,
            'order_number' => $orderNumber,
            'subtotal'     => (float)$data['subtotal'],
            'tax'          => (float)$data['tax'],
            'shipping'     => (float)$data['shipping'],
            'cod_fee'      => (float)($data['cod_fee'] ?? 0),
            'total'        => (float)$data['total'],
        ];
    }

    private function createOrderItems($orderId, $items) {
        $query = "INSERT INTO order_items 
                  (order_id, product_id, product_name, price, quantity, unit, subtotal) 
                  VALUES (:order_id, :product_id, :product_name, :price, :quantity, :unit, :subtotal)";

        foreach ($items as $item) {
            $this->executeQuery($query, [
                ':order_id'     => $orderId,
                ':product_id'   => $item['product_id'],
                ':product_name' => $item['product_name'],
                ':price'        => $item['price'],
                ':quantity'     => $item['quantity'],
                ':unit'         => $item['unit'] ?? 'lb',
                ':subtotal'     => $item['price'] * $item['quantity'],
            ]);
        }
    }

    public function findById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
        return $this->fetchOne($query, [':id' => $id]);
    }

    public function findByOrderNumber($orderNumber) {
        $query = "SELECT * FROM {$this->table} WHERE order_number = :order_number LIMIT 1";
        return $this->fetchOne($query, [':order_number' => $orderNumber]);
    }

    public function findByUserId($userId) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id ORDER BY created_at DESC";
        return $this->fetchAll($query, [':user_id' => $userId]);
    }

    public function getOrderItems($orderId) {
        $query = "SELECT oi.*, p.image 
                  FROM order_items oi 
                  LEFT JOIN products p ON oi.product_id = p.id 
                  WHERE oi.order_id = :order_id";
        return $this->fetchAll($query, [':order_id' => $orderId]);
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE {$this->table} SET status = :status WHERE id = :id";
        $this->executeQuery($query, [':status' => $status, ':id' => $id]);
        return true;
    }
}