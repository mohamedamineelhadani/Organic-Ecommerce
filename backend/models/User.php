<?php

require_once __DIR__ . '/Model.php';

class User extends Model {
    protected $table = "users";

    public function create($data) {
        $query = "INSERT INTO {$this->table} 
                  (full_name, email, password, phone, role) 
                  VALUES (:full_name, :email, :password, :phone, :role)";

        $params = [
            ':full_name' => trim($data['full_name']),
            ':email'     => strtolower(trim($data['email'])),
            ':password'  => password_hash($data['password'], PASSWORD_DEFAULT),
            ':phone'     => $data['phone'] ?? null,
            ':role'      => $data['role'] ?? 'customer',
        ];

        $this->executeQuery($query, $params);
        return $this->conn->lastInsertId();
    }

    public function findByEmail($email) {
        $query = "SELECT * FROM {$this->table} WHERE email = :email LIMIT 1";
        return $this->fetchOne($query, [':email' => strtolower(trim($email))]);
    }

    public function findById($id) {
        $query = "SELECT id, full_name, email, phone, role, created_at 
                  FROM {$this->table} WHERE id = :id LIMIT 1";
        return $this->fetchOne($query, [':id' => $id]);
    }

    public function verifyPassword($email, $password) {
        $user = $this->findByEmail($email);
        if (!$user || !password_verify($password, $user['password'])) {
            return false;
        }

        unset($user['password']);
        return $user;
    }

    public function update($id, $data) {
        $allowed = ['full_name', 'email', 'phone', 'password'];
        $fields  = [];
        $params  = [':id' => $id];

        foreach ($data as $key => $value) {
            if (!in_array($key, $allowed, true)) continue;

            $fields[] = "$key = :$key";
            $params[":$key"] = ($key === 'password')
                ? password_hash($value, PASSWORD_DEFAULT)
                : $value;
        }

        if (empty($fields)) return false;

        $query = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
        $this->executeQuery($query, $params);
        return true;
    }
}