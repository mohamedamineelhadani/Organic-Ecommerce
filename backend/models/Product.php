<?php

require_once __DIR__ . '/Model.php';

class Product extends Model {
    protected $table = "products";

    public function getAll($filters = []) {
        $query = "SELECT p.*, c.name AS category_name 
                  FROM {$this->table} p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE 1=1";
        $params = [];

        if (!empty($filters['category'])) {
            $query .= " AND c.name = :category";
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['search'])) {
            $query .= " AND (p.name LIKE :search OR p.description LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        switch ($filters['sort'] ?? '') {
            case 'price-low':  $query .= " ORDER BY p.price ASC"; break;
            case 'price-high': $query .= " ORDER BY p.price DESC"; break;
            case 'name':       $query .= " ORDER BY p.name ASC"; break;
            default:           $query .= " ORDER BY p.id ASC";
        }

        if (!empty($filters['limit'])) {
            $limit = (int)$filters['limit'];
            $query .= " LIMIT $limit";
        }

        return $this->fetchAll($query, $params);
    }

    public function findById($id) {
        $query = "SELECT p.*, c.name AS category_name 
                  FROM {$this->table} p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.id = :id LIMIT 1";
        return $this->fetchOne($query, [':id' => $id]);
    }

    public function getCategories() {
        $query = "SELECT c.id, c.name, COUNT(p.id) AS product_count 
                  FROM categories c 
                  LEFT JOIN products p ON p.category_id = c.id 
                  GROUP BY c.id, c.name 
                  ORDER BY c.name";
        return $this->fetchAll($query);
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                  (name, description, price, pricing_unit, quantity_stock, category_id, image, origin, season, nutrients, shelf_life) 
                  VALUES (:name, :description, :price, :pricing_unit, :quantity_stock, :category_id, :image, :origin, :season, :nutrients, :shelf_life)";

        $params = [
            ':name'           => $data['name'],
            ':description'    => $data['description'] ?? null,
            ':price'          => $data['price'],
            ':pricing_unit'   => $data['pricing_unit'] ?? 'lb',
            ':quantity_stock' => $data['quantity_stock'] ?? 0,
            ':category_id'    => $data['category_id'] ?? null,
            ':image'          => $data['image'] ?? null,
            ':origin'         => $data['origin'] ?? null,
            ':season'         => $data['season'] ?? null,
            ':nutrients'      => $data['nutrients'] ?? null,
            ':shelf_life'     => $data['shelf_life'] ?? null,
        ];

        $this->executeQuery($query, $params);
        return $this->conn->lastInsertId();
    }

    public function update($id, $data) {
        $allowed = ['name', 'description', 'price', 'pricing_unit', 'quantity_stock',
                    'category_id', 'image', 'origin', 'season', 'nutrients', 'shelf_life'];

        $fields = [];
        $params = [':id' => $id];

        foreach ($data as $key => $value) {
            if (!in_array($key, $allowed, true)) continue;
            $fields[] = "$key = :$key";
            $params[":$key"] = $value;
        }

        if (empty($fields)) return false;

        $query = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
        $this->executeQuery($query, $params);
        return true;
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $this->executeQuery($query, [':id' => $id]);
        return true;
    }
}