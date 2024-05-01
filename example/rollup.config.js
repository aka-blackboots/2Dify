import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: './../dist/src/index.js',
    output: [
        {
            format: 'esm',
            file: 'twoDify.js'
        },
    ],
    plugins: [
        nodeResolve(),
        commonjs()
    ]
};
