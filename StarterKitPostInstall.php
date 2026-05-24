<?php

class StarterKitPostInstall
{
    protected array $vizuallRepos = [
        'statamic-addon/code-editor'    => 'git@github.com:VizuallGit/statamic-addon-code-editor.git',
        'statamic-addon/color-scheme'   => 'git@github.com:VizuallGit/statamic-addon-color-scheme.git',
        'statamic-addon/column-builder' => 'git@github.com:VizuallGit/statamic-addon-column-builder.git',
        'statamic-addon/modifiers'      => 'git@github.com:VizuallGit/statamic-addon-modifiers.git',
        'statamic-addon/sections'       => 'git@github.com:VizuallGit/statamic-addon-sections.git',
        'statamic-addon/spacing'        => 'git@github.com:VizuallGit/statamic-addon-spacing.git',
        'statamic-addon/tabs'           => 'git@github.com:VizuallGit/statamic-addon-tabs.git',
    ];

    public function handle($console): void
    {
        $console->line('');
        $console->line('Tilføjer Vizuall custom addons...');

        $composerPath = getcwd() . '/composer.json';
        $composer = json_decode(file_get_contents($composerPath), true);

        // Tilføj VCS-repos for alle custom addons
        $existing = collect($composer['repositories'] ?? [])
            ->pluck('url')
            ->toArray();

        foreach ($this->vizuallRepos as $package => $url) {
            if (! in_array($url, $existing)) {
                $composer['repositories'][] = ['type' => 'vcs', 'url' => $url];
            }
        }

        file_put_contents($composerPath, json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL);

        // Installer custom addons via composer
        $packages = collect($this->vizuallRepos)
            ->keys()
            ->map(fn ($p) => "$p:^1.0")
            ->implode(' ');

        $console->line('Kører composer require for custom addons...');
        passthru("composer require $packages --no-interaction");

        $console->line('');
        $console->line('Bygger CP-assets (npm install && npm run cp:build)...');
        passthru('npm install --no-audit --no-fund');
        passthru('npm run cp:build');

        $console->line('');
        $console->info('Vizuall starter kit er klar! Kør evt. npm run build for frontend-assets.');
    }
}
