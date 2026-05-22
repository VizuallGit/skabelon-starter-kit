(function () {
    'use strict';

    // Injicér @font-face via JS så Vite ikke processerer font-URLer som CSS-assets
    (function () {
        if (document.getElementById('cp-fonts')) return;
        const s = document.createElement('style');
        s.id = 'cp-fonts';
        s.textContent = [
            ['Bitter',         'Bitter'],
            ['Cairo',          'Cairo'],
            ['Exo 2',          'Exo2'],
            ['Inter',          'Inter'],
            ['Merriweather',   'Merriweather'],
            ['Montserrat',     'Montserrat'],
            ['Oswald',         'Oswald'],
            ['Roboto',         'Roboto'],
            ['Source Serif 4', 'SourceSerif4'],
        ].map(([family, file]) =>
            `@font-face{font-family:"${family}";src:url("/fonts/${file}.woff2") format("woff2-variations");font-weight:300 900;font-display:swap;}`
        ).join('');
        document.head.appendChild(s);
    }());

    // Skjul felter for ikke-admin brugere via custom conditions
    Statamic.booting(() => {
        // text-100…text-900 er eksklusive — kun én ad gangen pr. tekstnode.
        // Kører på ProseMirror-transaktionsniveau, uafhængigt af knapper/commands.
        const BTS_SIZE_CLASSES = new Set([
            'text-100','text-200','text-300','text-400','text-500',
            'text-600','text-700','text-800','text-900',
        ]);
        Statamic.$bard.addExtension(({ tiptap }) => {
            return tiptap.core.Extension.create({
                name: 'btsSpanExclusive',
                onTransaction({ editor, transaction }) {
                    if (!transaction.docChanged || transaction.getMeta('btsSpanCleanup')) return;
                    const markType = editor.state.schema.marks.btsSpan;
                    if (!markType) return;
                    // Find ud af hvilken size-class der netop blev tilføjet
                    let justAddedClass = null;
                    transaction.steps.forEach(step => {
                        const t = step.toJSON?.()?.stepType;
                        if (t === 'addMark' && step.mark?.type === markType) {
                            const cls = step.mark.attrs.class;
                            if (BTS_SIZE_CLASSES.has(cls)) justAddedClass = cls;
                        }
                    });
                    if (!justAddedClass) return;
                    // Fjern alle andre size-marks fra samme tekstnoder
                    const state = editor.state;
                    const removals = [];
                    state.doc.descendants((node, pos) => {
                        if (!node.isText) return;
                        node.marks.forEach(mark => {
                            if (mark.type === markType && BTS_SIZE_CLASSES.has(mark.attrs.class) && mark.attrs.class !== justAddedClass) {
                                removals.push({ mark, pos, size: node.nodeSize });
                            }
                        });
                    });
                    if (removals.length === 0) return;
                    const tr = state.tr;
                    removals.forEach(({ mark, pos, size }) => tr.removeMark(pos, pos + size, mark));
                    tr.setMeta('btsSpanCleanup', true);
                    editor.view.dispatch(tr);
                },
            });
        });

        Statamic.$conditions.add('isAdmin', function () {
            return Statamic.$permissions.has('super');
        });

        // Bruges på settings-grupper der styres af en show_settings revealer
        Statamic.$conditions.add('adminSettingsVisible', function ({ values }) {
            if (!Statamic.$permissions.has('super')) return false;
            return values?.show_settings === true;
        });

        // Skjul "Developer" replicator-gruppe for ikke-admins via MutationObserver
        if (!Statamic.$permissions.has('super')) {
            const observer = new MutationObserver(() => {
                document.querySelectorAll('.replicator-set-picker-group').forEach(group => {
                    const heading = group.querySelector('.replicator-set-picker-group-heading, [class*="group-heading"], h6, strong, span');
                    if (heading && heading.textContent.trim() === 'Developer') {
                        group.style.display = 'none';
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });

    Statamic.booting(() => {
        // ── Delt VS Code tema-builder til alle code-editorer ────────────────
        async function buildVscTheme(isDark) {
            const [
                { EditorView },
                { HighlightStyle, syntaxHighlighting },
                { tags },
            ] = await Promise.all([
                import('@codemirror/view'),
                import('@codemirror/language'),
                import('@lezer/highlight'),
            ]);

            const dark = EditorView.theme({
                '&': { backgroundColor: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', overflow: 'hidden' },
                '.cm-content': { caretColor: '#aeafad', padding: '12px 0', fontFamily: '"Cascadia Code","Fira Code","Consolas","Courier New",monospace', fontSize: '13px', lineHeight: '1.6' },
                '.cm-cursor': { borderLeftColor: '#aeafad' },
                '.cm-activeLine': { backgroundColor: '#ffffff0d' },
                '.cm-activeLineGutter': { backgroundColor: '#ffffff0d' },
                '.cm-gutters': { backgroundColor: '#1e1e1e', color: '#858585', border: 'none', borderRight: '1px solid #3c3c3c' },
                '.cm-lineNumbers .cm-gutterElement': { paddingLeft: '8px', paddingRight: '12px' },
                '.cm-scroller': { overflow: 'auto', minHeight: '200px', maxHeight: '600px' },
                '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: '#264f78 !important' },
                '.cm-tooltip': { backgroundColor: '#252526', border: '1px solid #454545', borderRadius: '4px' },
                '.cm-tooltip-autocomplete ul li': { padding: '2px 8px', color: '#d4d4d4' },
                '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: '#094771', color: '#ffffff' },
                '.cm-completionIcon': { opacity: '0.7' },
            }, { dark: true });

            const darkHighlight = syntaxHighlighting(HighlightStyle.define([
                { tag: tags.keyword,        color: '#569cd6' },
                { tag: tags.string,         color: '#ce9178' },
                { tag: tags.comment,        color: '#6a9955', fontStyle: 'italic' },
                { tag: tags.number,         color: '#b5cea8' },
                { tag: tags.className,      color: '#d7ba7d' },
                { tag: tags.tagName,        color: '#4ec9b0' },
                { tag: tags.propertyName,   color: '#9cdcfe' },
                { tag: tags.variableName,   color: '#9cdcfe' },
                { tag: tags.attributeName,  color: '#9cdcfe' },
                { tag: tags.attributeValue, color: '#ce9178' },
                { tag: tags.angleBracket,   color: '#808080' },
                { tag: tags.unit,           color: '#b5cea8' },
                { tag: tags.color,          color: '#ce9178' },
                { tag: tags.bracket,        color: '#ffd700' },
                { tag: tags.punctuation,    color: '#d4d4d4' },
                { tag: tags.operator,       color: '#d4d4d4' },
            ]));

            const light = EditorView.theme({
                '&': { backgroundColor: '#ffffff', color: '#000000', borderRadius: '6px', overflow: 'hidden' },
                '.cm-content': { caretColor: '#000000', padding: '12px 0', fontFamily: '"Cascadia Code","Fira Code","Consolas","Courier New",monospace', fontSize: '13px', lineHeight: '1.6' },
                '.cm-activeLine': { backgroundColor: '#0000000d' },
                '.cm-activeLineGutter': { backgroundColor: '#0000000d' },
                '.cm-gutters': { backgroundColor: '#f3f3f3', color: '#237893', border: 'none', borderRight: '1px solid #e8e8e8' },
                '.cm-lineNumbers .cm-gutterElement': { paddingLeft: '8px', paddingRight: '12px' },
                '.cm-scroller': { overflow: 'auto', minHeight: '200px', maxHeight: '600px' },
                '.cm-tooltip': { backgroundColor: '#f3f3f3', border: '1px solid #c8c8c8', borderRadius: '4px' },
                '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: '#0060c0', color: '#ffffff' },
            });

            const lightHighlight = syntaxHighlighting(HighlightStyle.define([
                { tag: tags.keyword,        color: '#0000ff' },
                { tag: tags.string,         color: '#a31515' },
                { tag: tags.comment,        color: '#008000', fontStyle: 'italic' },
                { tag: tags.number,         color: '#098658' },
                { tag: tags.tagName,        color: '#800000' },
                { tag: tags.attributeName,  color: '#ff0000' },
                { tag: tags.attributeValue, color: '#0000ff' },
                { tag: tags.propertyName,   color: '#001080' },
                { tag: tags.angleBracket,   color: '#800000' },
                { tag: tags.className,      color: '#267f99' },
                { tag: tags.unit,           color: '#098658' },
                { tag: tags.punctuation,    color: '#000000' },
            ]));

            return isDark ? [dark, darkHighlight] : [light, lightHighlight];
        }

        function detectDarkMode() {
            return document.documentElement.classList.contains('dark')
                || document.body.classList.contains('dark');
        }

        // ── Generic Code Editor fieldtype (html / css) ──────────────────────
        Statamic.$components.register('code-editor-fieldtype', {
            props: {
                value:  { type: String, default: '' },
                meta:   { type: Object, default: () => ({}) },
                config: { type: Object, default: () => ({}) },
            },
            emits: ['update:value', 'focus', 'blur'],
            setup(props, { emit }) {
                const { ref, onMounted, onBeforeUnmount, watch } = window.Vue;
                const container = ref(null);
                let view = null;

                onMounted(async () => {
                    const lang = props.config?.language || 'html';
                    const [
                        { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter },
                        { EditorState },
                        { defaultKeymap, indentWithTab, historyKeymap, history },
                        { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap },
                        langModule,
                        theme,
                    ] = await Promise.all([
                        import('@codemirror/view'),
                        import('@codemirror/state'),
                        import('@codemirror/commands'),
                        import('@codemirror/autocomplete'),
                        lang === 'css' ? import('@codemirror/lang-css') : import('@codemirror/lang-html'),
                        buildVscTheme(detectDarkMode()),
                    ]);

                    const langExtension = lang === 'css'
                        ? langModule.css()
                        : langModule.html({ autoCloseTags: true });

                    const updateListener = EditorView.updateListener.of((update) => {
                        if (update.docChanged) emit('update:value', update.state.doc.toString());
                    });

                    view = new EditorView({
                        state: EditorState.create({
                            doc: props.value || '',
                            extensions: [
                                lineNumbers(), highlightActiveLine(), highlightActiveLineGutter(),
                                history(), langExtension, closeBrackets(), autocompletion(),
                                keymap.of([...defaultKeymap, indentWithTab, ...historyKeymap, ...completionKeymap, ...closeBracketsKeymap]),
                                updateListener, EditorView.lineWrapping, ...theme,
                            ],
                        }),
                        parent: container.value,
                    });
                });

                watch(() => props.value, (newVal) => {
                    if (!view) return;
                    const current = view.state.doc.toString();
                    if (current !== newVal) view.dispatch({ changes: { from: 0, to: current.length, insert: newVal || '' } });
                });

                onBeforeUnmount(() => { if (view) view.destroy(); });

                return () => window.Vue.h('div', { ref: container, class: 'code-editor-wrap' });
            },
        });

        // ── CSS Editor fieldtype ─────────────────────────────────────────────
        Statamic.$components.register('css-editor-fieldtype', {
            props: {
                value:  { type: String, default: '' },
                meta:   { type: Object, default: () => ({}) },
                config: { type: Object, default: () => ({}) },
            },
            emits: ['update:value', 'focus', 'blur'],
            setup(props, { emit }) {
                const { ref, onMounted, onBeforeUnmount, watch } = window.Vue;
                const container = ref(null);
                let view = null;

                onMounted(async () => {
                    const [
                        { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter },
                        { EditorState },
                        { defaultKeymap, indentWithTab, historyKeymap, history },
                        { css, cssCompletionSource },
                        { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap },
                        theme,
                    ] = await Promise.all([
                        import('@codemirror/view'),
                        import('@codemirror/state'),
                        import('@codemirror/commands'),
                        import('@codemirror/lang-css'),
                        import('@codemirror/autocomplete'),
                        buildVscTheme(detectDarkMode()),
                    ]);

                    const updateListener = EditorView.updateListener.of((update) => {
                        if (update.docChanged) emit('update:value', update.state.doc.toString());
                    });

                    view = new EditorView({
                        state: EditorState.create({
                            doc: props.value || '',
                            extensions: [
                                lineNumbers(), highlightActiveLine(), highlightActiveLineGutter(),
                                history(), css(), closeBrackets(),
                                autocompletion({ override: [cssCompletionSource] }),
                                keymap.of([...defaultKeymap, indentWithTab, ...historyKeymap, ...completionKeymap, ...closeBracketsKeymap]),
                                updateListener, EditorView.lineWrapping, ...theme,
                            ],
                        }),
                        parent: container.value,
                    });
                });

                watch(() => props.value, (newVal) => {
                    if (!view) return;
                    const current = view.state.doc.toString();
                    if (current !== newVal) view.dispatch({ changes: { from: 0, to: current.length, insert: newVal || '' } });
                });

                onBeforeUnmount(() => { if (view) view.destroy(); });

                return () => window.Vue.h('div', { ref: container, class: 'code-editor-wrap' });
            },
        });

    });

    // Auto-open a replicator set on page load:
    //   #open=N      → Nth top-level [data-replicator-set] (page sections)
    //   ?cs=N#colors → Nth [data-replicator-set][data-type="color_scheme"] + switch to Colors tab
    //                  #colors activates the tab via Statamic's setActiveTabFromHash();
    //                  JS polls as fallback for when rememberTab is false.
    (function () {
        const mPage   = window.location.hash.match(/^#open=(\d+)$/);
        const csParam = new URLSearchParams(window.location.search).get('cs');
        const mScheme = csParam !== null;
        if (!mPage && !mScheme) return;

        const targetIndex = parseInt(mPage ? mPage[1] : csParam, 10);
        const MAX_MS      = 8000;
        const INTERVAL    = 150;
        const start       = Date.now();

        function findTarget() {
            if (mScheme) {
                const all = [...document.querySelectorAll('[data-replicator-set][data-type="color_scheme"]')];
                return all[targetIndex] ?? null;
            }
            const topLevel = [...document.querySelectorAll('[data-replicator-set]')]
                .filter(el => !el.parentElement?.closest('[data-replicator-set]'));
            return topLevel[targetIndex] ?? null;
        }

        function tryOpen() {
            const target = findTarget();

            if (!target) {
                if (mScheme) {
                    // Color scheme-sets er ikke i DOM endnu — Colors-fanen er sandsynligvis ikke aktiv.
                    // Statamic's setActiveTabFromHash() burde have håndteret #colors-hash; dette er fallback.
                    const colorsTab = [...document.querySelectorAll('[role="tab"]')]
                        .find(t => t.textContent.trim().toLowerCase() === 'colors');
                    if (colorsTab && colorsTab.getAttribute('aria-selected') !== 'true') {
                        colorsTab.click();
                    }
                }
                if (Date.now() - start < MAX_MS) setTimeout(tryOpen, INTERVAL);
                return;
            }

            if (target.dataset.collapsed !== 'false') {
                target.querySelector('header button')?.click();
            }

            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const prev = target.style.outline;
                target.style.outline      = '2px solid #3b82f6';
                target.style.borderRadius = '4px';
                setTimeout(() => { target.style.outline = prev; }, 2000);
            }, 350);
        }

        setTimeout(tryOpen, 600);
    }());


}());
