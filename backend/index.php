<?php
require_once __DIR__ . '/config/Config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 0);


$origin = $_SERVER['HTTP_ORIGIN'] ?? '';


if (in_array($origin, Config::ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} else {
    if (!empty($origin)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'CORS policy violation']);
        exit;
    }
}


header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Autoload
spl_autoload_register(function ($class) {
    $paths = [
        __DIR__ . '/config/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
        __DIR__ . '/controllers/' . $class . '.php',
    ];
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri           = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);




// Strip base path
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptDir !== '/' && strpos($uri, $scriptDir) === 0) {
    $uri = substr($uri, strlen($scriptDir));
}

$uri      = ltrim($uri, '/');
$segments = array_values(array_filter(explode('/', $uri)));


try {
    // Root
    if (empty($segments)) {
        echo json_encode([
            'success' => true,
            'message' => 'ORGANIC Ecommerce API',
            'version' => '1.0.0',
            'endpoints' => [
                'POST   /api/auth/register',
                'POST   /api/auth/login',
                'GET    /api/auth/profile',
                'GET    /api/products',
                'GET    /api/products?id={id}',
                'GET    /api/products/categories',
                'GET    /api/cart',
                'POST   /api/cart',
                'PUT    /api/cart',
                'DELETE /api/cart?product_id={id}',
                'DELETE /api/cart',
                'POST   /api/orders',
                'GET    /api/orders',
                'GET    /api/orders?id={id}',
                'GET    /api/orders?order_number={n}',
                'POST   /api/subscriptions',
                'GET    /api/subscriptions',
                'POST   /api/contact',
                'GET    /api/contact',
            ],
        ]);
        exit;
    }

    if ($segments[0] !== 'api') {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Route not found']);
        exit;
    }

    array_shift($segments); // drop 'api'
    $controller = $segments[0] ?? null;
    $action     = $segments[1] ?? null;

    // ---------- AUTH ----------
    if ($controller === 'auth') {
        $auth = new AuthController();
        match ($action) {
            'register' => $auth->register(),
            'login'    => $auth->login(),
            'profile'  => $auth->getProfile(),
            default    => (function () {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Auth endpoint not found']);
            })(),
        };
        exit;
    }

    // ---------- PRODUCTS ----------
    if ($controller === 'products') {
        $products = new ProductController();

        if ($action === 'categories') {
            $products->getCategories();
        } elseif ($requestMethod === 'POST') {
            $products->create();
        } elseif ($requestMethod === 'PUT') {
            $products->update();
        } elseif ($requestMethod === 'DELETE') {
            $products->delete();
        } elseif (isset($_GET['id'])) {
            $products->getById();
        } else {
            $products->getAll();
        }
        exit;
    }

    // ---------- CART ----------
    if ($controller === 'cart') {
        $cart = new CartController();

        if ($requestMethod === 'GET') {
            $cart->getCart();
        } elseif ($requestMethod === 'POST') {
            $cart->addItem();
        } elseif ($requestMethod === 'PUT') {
            $cart->updateQuantity();
        } elseif ($requestMethod === 'DELETE') {
            if (isset($_GET['product_id'])) {
                $cart->removeItem();
            } else {
                $cart->clearCart();
            }
        }
        exit;
    }

    // ---------- ORDERS ----------
    if ($controller === 'orders') {
        $orders = new OrderController();

        if ($requestMethod === 'POST') {
            $orders->create();
        } elseif ($requestMethod === 'GET') {
            if (isset($_GET['id'])) {
                $orders->getById();
            } elseif (isset($_GET['order_number'])) {
                $orders->getByOrderNumber();
            } else {
                $orders->getUserOrders();
            }
        }
        exit;
    }


    // ----- SUBSCRIPTIONS -----
    if ($controller === 'subscriptions') {
        $subs = new SubscriptionController();
        if ($requestMethod === 'POST') {
            $subs->subscribe();
        } elseif ($requestMethod === 'GET') {
            $subs->getAll();
        }
        exit;
    }

    // ----- CONTACT -----
    if ($controller === 'contact') {
        $contact = new ContactController();
        if ($requestMethod === 'POST') {
            $contact->send();
        } elseif ($requestMethod === 'GET') {
            $contact->getAll();
        }
        exit;
    }



    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
    ]);
}