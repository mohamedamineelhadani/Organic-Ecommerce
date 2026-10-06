<?php

require_once __DIR__ . '/Model.php';

class Cart extends Model {
    protected $table = "cart";

    public function addItem($userId, $productId, $quantity = 1) {
        $existing = $this->getItem($userId, $productId);

        if ($existing) {
            $query = "UPDATE {$this->table} 
                      SET quantity = quantity + :quantity, updated_at = CURRENT_TIMESTAMP 
                      WHERE user_id = :user_id AND product_id = :product_id";
            $this->executeQuery($query, [
                ':user_id'    => $userId,
                ':product_id' => $productId,
                ':quantity'   => $quantity,
            ]);
        } else {
            $query = "INSERT INTO {$this->table} (user_id, product_id, quantity) 
                      VALUES (:user_id, :product_id, :quantity)";
            $this->executeQuery($query, [
                ':user_id'    => $userId,
                ':product_id' => $productId,
                ':quantity'   => $quantity,
            ]);
        }

        return true;
    }

    public function getItem($userId, $productId) {
        $query = "SELECT * FROM {$this->table} 
                  WHERE user_id = :user_id AND product_id = :product_id LIMIT 1";
        return $this->fetchOne($query, [
            ':user_id'    => $userId,
            ':product_id' => $productId,
        ]);
    }

    public function getCart($userId) {
        $query = "SELECT c.product_id, c.quantity, 
                         p.name, p.price, p.pricing_unit AS unit, p.image, 
                         cat.name AS category_name
                  FROM {$this->table} c
                  INNER JOIN products p ON c.product_id = p.id
                  LEFT JOIN categories cat ON p.category_id = cat.id
                  WHERE c.user_id = :user_id
                  ORDER BY c.created_at DESC";

        $items = $this->fetchAll($query, [':user_id' => $userId]);

        return array_map(function ($item) {
            return [
                'id'       => (int)$item['product_id'],
                'name'     => $item['name'],
                'price'    => (float)$item['price'],
                'unit'     => $item['unit'],
                'category' => $item['category_name'],
                'image'    => $item['image'],
                'quantity' => (int)$item['quantity'],
            ];
        }, $items);
    }

    public function updateQuantity($userId, $productId, $quantity) {
        if ($quantity <= 0) {
            return $this->removeItem($userId, $productId);
        }

        $query = "UPDATE {$this->table} 
                  SET quantity = :quantity, updated_at = CURRENT_TIMESTAMP 
                  WHERE user_id = :user_id AND product_id = :product_id";
        $this->executeQuery($query, [
            ':user_id'    => $userId,
            ':product_id' => $productId,
            ':quantity'   => $quantity,
        ]);
        return true;
    }

    public function removeItem($userId, $productId) {
        $query = "DELETE FROM {$this->table} 
                  WHERE user_id = :user_id AND product_id = :product_id";
        $this->executeQuery($query, [
            ':user_id'    => $userId,
            ':product_id' => $productId,
        ]);
        return true;
    }

    public function clearCart($userId) {
        $query = "DELETE FROM {$this->table} WHERE user_id = :user_id";
        $this->executeQuery($query, [':user_id' => $userId]);
        return true;
    }
}