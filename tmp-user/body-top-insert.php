<?php
if (is_404()) {
    $request_uri = $_SERVER['REQUEST_URI'];
    if (preg_match('^/community/.+/?/^', $request_uri)) {
        $scheme = (is_ssl() ? 'https' : 'http') . '://';
        $host = $_SERVER['HTTP_HOST'];
        $request = '/community/?asmo_pagename=' . substr($request_uri, 11);
        wp_redirect( $scheme . $host . $request );
    }
}
