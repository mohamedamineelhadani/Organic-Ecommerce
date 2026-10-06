<?php

class Config {
    const JWT_SECRET = "your-secret-key-change-in-production";
    
    const ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ];
    
    const TAX_RATE = 0.08;
    
    const FREE_SHIPPING_THRESHOLD = 50.00;
    const SHIPPING_COST = 4.99;
    const COD_FEE = 2.99;
    
    const PRODUCTS_PER_PAGE = 20;
}



