<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Styles
    |--------------------------------------------------------------------------
    |
    | List of styles.
    |
    */

    'styles' => [

        'text_100' => [
            'type' => 'span',
            'name' => 'Size 100',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-100',
            'cp_css' => 'font-size: 0.8rem;',
            'cp_badge' => false,
        ],

        'text_200' => [
            'type' => 'span',
            'name' => 'Size 200',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-200',
            'cp_css' => 'font-size: 1rem;',
            'cp_badge' => false,
        ],

        'text_300' => [
            'type' => 'span',
            'name' => 'Size 300',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-300',
            'cp_css' => 'font-size: 1.2rem;',
            'cp_badge' => false,
        ],

        'text_400' => [
            'type' => 'span',
            'name' => 'Size 400',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-400',
            'cp_css' => 'font-size: 1.4rem;',
            'cp_badge' => false,
        ],

        'text_500' => [
            'type' => 'span',
            'name' => 'Size 500',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-500',
            'cp_css' => 'font-size: 1.6rem;',
            'cp_badge' => false,
        ],
    
        'text_600' => [
            'type' => 'span',
            'name' => 'Size 600',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-600',
            'cp_css' => 'font-size: 1.8rem;',
            'cp_badge' => false,
        ],

        'text_700' => [
            'type' => 'span',
            'name' => 'Size 700',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-700',
            'cp_css' => 'font-size: 2rem;',
            'cp_badge' => false,
        ],

        'text_800' => [
            'type' => 'span',
            'name' => 'Size 800',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-800',
            'cp_css' => 'font-size: 2.2rem;',
            'cp_badge' => false,
        ],

        'text_900' => [
            'type' => 'span',
            'name' => 'Size 900',
            'ident' => 'T',
            'icon' => null,
            'class' => 'text-900',
            'cp_css' => 'font-size: 2.4rem;',
            'cp_badge' => false,
        ],

        // 'title' => [
        //     'type' => 'heading_1',
        //     'name' => 'Title',
        //     'ident' => 'T',
        //     'icon' => null,
        //     'class' => 'title',
        //     'cp_css' => 'text-decoration: underline; text-underline-offset: 0.1em; text-decoration-color: #c5ccd4',
        //     'cp_badge' => false,
        // ],

        // 'lead' => [
        //     'type' => 'paragraph',
        //     'name' => 'Lead',
        //     'ident' => 'L',
        //     'icon' => null,
        //     'class' => 'lead',
        //     'cp_css' => 'font-size: 1.25em; margin-top: -0.5em',
        //     'cp_badge' => false,
        // ],

        // 'brand' => [
        //     'type' => 'span',
        //     'name' => 'Brand Text',
        //     'ident' => 'B',
        //     'icon' => null,
        //     'class' => 'brand-text',
        //     'cp_css' => 'color: #ff269e; font-weight: 700',
        //     'cp_badge' => false,
        // ],

        // 'action' => [
        //     'type' => 'link',
        //     'name' => 'Action',
        //     'ident' => 'A',
        //     'icon' => null,
        //     'class' => 'action',
        //     'cp_css' => 'background: #737f8d; color: white; padding: 0.2em 0.5em; border-radius: 4px',
        //     'cp_badge' => false,
        // ],

        // 'square_list' => [
        //     'type' => 'unordered_list',
        //     'name' => 'Square List',
        //     'ident' => '■',
        //     'icon' => null,
        //     'class' => 'square-list',
        //     'cp_css' => 'list-style-type: square',
        //     'cp_badge' => false,
        // ],

        // 'roman_list' => [
        //     'type' => 'ordered_list',
        //     'name' => 'Roman List',
        //     'ident' => 'IV',
        //     'icon' => null,
        //     'class' => 'roman-list',
        //     'cp_css' => [
        //         '&' => 'list-style-type: upper-roman',
        //         '& ol' => 'list-style-type: lower-roman',
        //     ],
        //     'cp_badge' => false,
        // ],

        // 'two_columns' => [
        //     'type' => 'div',
        //     'name' => 'Two Columns',
        //     'ident' => '❙ ❙',
        //     'icon' => null,
        //     'class' => 'two-columns',
        //     'cp_css' => 'column-count: 2; column-gap: 16px',
        //     'cp_badge' => true,
        // ],

        // 'three_columns' => [
        //     'type' => 'div',
        //     'name' => 'Three Columns',
        //     'ident' => '❙❙❙',
        //     'icon' => null,
        //     'class' => 'three-columns',
        //     'cp_css' => 'column-count: 3; column-gap: 16px',
        //     'cp_badge' => true,
        // ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Pins (pro only)
    |--------------------------------------------------------------------------
    |
    | List of pins.
    |
    */

    'pins' => [

        // 'icon' => [
        //     'display' => 'Icon',
        //     'icon' => 'fire-flame-burn-hot',
        //     'instructions' => 'An icon graphic.',
        //     'fields' => [
        //         'src' => [
        //             'display' => 'Icon',
        //             'type' => 'assets',
        //             'max_files' => 1,
        //             'mode' => 'list',
        //         ],
        //     ],
        // ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Pins Path (pro only)
    |--------------------------------------------------------------------------
    |
    | The default view path for pin templates. Individual pins can override
    | this by setting their own "view" key in the pin configuration.
    |
    */

    'pins_path' => 'partials/pins',

    /*
    |--------------------------------------------------------------------------
    | Attributes (pro only)
    |--------------------------------------------------------------------------
    |
    | The attributes that can be edited through the attributes panel.
    |
    */

    'attributes' => [

        // 'heading_1' => [
        //     'id' => [
        //         'type' => 'text',
        //         'display' => 'ID',
        //         'default' => null,
        //         'rendered' => true,
        //     ],
        //     'hero' => [
        //         'type' => 'toggle',
        //         'display' => 'Hero',
        //         'default' => null,
        //         'rendered' => 'class',
        //         'values' => [
        //             'true' => 'hero',
        //         ],
        //     ],
        // ],

        // 'ordered_list' => [
        //     'start' => [
        //         'type' => 'text',
        //         'display' => 'Start',
        //         'default' => null,
        //         'rendered' => true,
        //     ],
        //     'reversed' => [
        //         'type' => 'toggle',
        //         'display' => 'Reversed',
        //         'default' => null,
        //         'rendered' => true,
        //     ],
        // ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Defaults
    |--------------------------------------------------------------------------
    |
    | Default styles that will be applied to elements with no style set. It's
    | also possible configure multiple sets of defaults to use with different
    | Bard fields, refer to the docs for more info.
    |
    */

    'defaults' => [

        // 'heading_1' => [
        //     'class' => 'heading-1',
        //     'cp_css' => null,
        //     'cp_badge' => false,
        // ],
        // 'heading_2' => [
        //     'class' => 'heading-2',
        //     'cp_css' => null,
        //     'cp_badge' => false,
        // ],
        // 'paragraph' => [
        //     'class' => 'paragraph',
        //     'cp_css' => null,
        //     'cp_badge' => false,
        // ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Store
    |--------------------------------------------------------------------------
    |
    | By default the class names are saved to your content. If you would prefer
    | to save the style keys instead you can change this option to "key".
    |
    */

    'store' => 'class',

];
