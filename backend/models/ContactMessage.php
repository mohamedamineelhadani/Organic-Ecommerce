<?php

require_once __DIR__ . '/Model.php';

class ContactMessage extends Model {
    protected $table = "contact_messages";

    public function create($data) {
        $query = "INSERT INTO {$this->table} (email, subject, message) 
                  VALUES (:email, :subject, :message)";

        $params = [
            ':email'   => strtolower(trim($data['email'])),
            ':subject' => !empty($data['subject']) ? trim($data['subject']) : null,
            ':message' => trim($data['message']),
        ];

        $this->executeQuery($query, $params);
        return (int)$this->conn->lastInsertId();
    }

    public function findById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
        return $this->fetchOne($query, [':id' => $id]);
    }

    public function findAll($limit = 100) {
        $limit = (int)$limit;
        $query = "SELECT * FROM {$this->table} 
                  ORDER BY created_at DESC 
                  LIMIT {$limit}";
        return $this->fetchAll($query);
    }

    public function markAsRead($id) {
        $query = "UPDATE {$this->table} SET updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $this->executeQuery($query, [':id' => $id]);
        return true;
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $this->executeQuery($query, [':id' => $id]);
        return true;
    }
}