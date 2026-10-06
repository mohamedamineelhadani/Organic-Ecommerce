<?php

require_once __DIR__ . '/../config/Database.php';

abstract class Model {
    protected $conn;
    protected $table;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    protected function executeQuery($query, $params = []) {
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Query error: " . $e->getMessage());
            throw new Exception("Database query failed: " . $e->getMessage());
        }
    }

    protected function fetchAll($query, $params = []) {
        $stmt = $this->executeQuery($query, $params);
        return $stmt->fetchAll();
    }

    protected function fetchOne($query, $params = []) {
        $stmt = $this->executeQuery($query, $params);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}