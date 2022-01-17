import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// @ts-ignore
// import viteRawPlugin from 'vite-raw-plugin'
import vueJsx from '@vitejs/plugin-vue-jsx'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // https://www.npmjs.com/package/@vitejs/plugin-vue-jsx
        vueJsx(),
        // viteRawPlugin({
        //     fileRegex: /\.md$/,
        // })
    ],
    build: {
        target: "esnext",
        // https://vitejs.dev/config/#build-commonjsoptions
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'vue3-quill-edit',
            formats: ['es'],
            fileName: (format) => `index.js`
        },
        rollupOptions: {
            // input: 'test.html',
            // 将不需要打包到库里面的依赖排除掉
            // https://github.com/vuejs/vue-next/issues/1503#issuecomment-653849674            
            external: [
                'vue',
                'quill',
            ],
            plugins: [
                copy({
                    targets: [{ src: 'types/**/*', dest: 'dist' }, { src: 'src/styles/var.css', dest: 'dist' }],
                    hook: 'writeBundle' // 重要
                })
            ],
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        },
        ssr: false,
        sourcemap: false,
        brotliSize: false,
        chunkSizeWarningLimit: 10000,
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true, // 想要less的modifyVars生效，这个必须启用
            }
        }
    },
    resolve: {
        alias: [
            { find: /^vue$/, replacement: resolve(__dirname, './node_modules/vue') },
            { find: /^quill$/, replacement: resolve(__dirname, './node_modules/quill') },
        ]
    }
})
