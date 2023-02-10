<!DOCTYPE html>
<html lang="ja" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>Community(仮)</title>
    <meta name="application-name" content="Amplifier Community">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?=get_stylesheet_directory_uri() . '/dist/main.css'?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script>
        const WP_API_SETTINGS = {
            nonce: '<?=wp_create_nonce('wp_rest')?>'
        }
    </script>
</head>
<body>
    <div id="app"></div>
    <script src="<?=get_stylesheet_directory_uri() . '/dist/main.js'?>"></script>
</body>
</html>