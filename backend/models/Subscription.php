<?php

require_once __DIR__ . '/Model.php';

class Subscription extends Model {
    protected $table = "subscriptions";

    /**
     * Subscribe an email. Returns true if new, false if already subscribed.
     */
    public function subscribe($email) {
        $email = strtolower(trim($email));

        // Check if already subscribed
        $existing = $this->findByEmail($email);
        if ($existing) {
            return false; // already subscribed
        }

        $query = "INSERT INTO {$this->table} (email) VALUES (:email)";
        $this->executeQuery($query, [':email' => $email]);

        return true;
    }

    public function findByEmail($email) {
        $query = "SELECT * FROM {$this->table} WHERE email = :email LIMIT 1";
        return $this->fetchOne($query, [':email' => strtolower(trim($email))]);
    }

    public function findAll($limit = 100) {
        $limit = (int)$limit;
        $query = "SELECT id, email, created_at 
                  FROM {$this->table} 
                  ORDER BY created_at DESC 
                  LIMIT {$limit}";
        return $this->fetchAll($query);
    }

    public function count() {
        $query = "SELECT COUNT(*) AS total FROM {$this->table}";
        $row = $this->fetchOne($query);
        return (int)($row['total'] ?? 0);
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $this->executeQuery($query, [':id' => $id]);
        return true;
    }
}