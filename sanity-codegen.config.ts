import { SanityCodegenConfig } from 'sanity-codegen';

const config: SanityCodegenConfig = {
    schemaPath: './app/studio/schemas/index.ts',
    outputPath: './src/types/sanity-schema.d.ts',
    babelOptions: {
        plugins: [
            [
                'module-resolver',
                {
                    root: ['.'],
                    alias: {
                        'part:@sanity/base/schema-creator': 'sanity-codegen/schema-creator-shim',
                        'all:part:@sanity/base/schema-type': 'sanity-codegen/schema-type-shim',
                        'part:@sanity/base/schema-type': 'sanity-codegen/schema-type-shim',
                        '^part:.*': 'sanity-codegen/no-op',
                        '^config:.*': 'sanity-codegen/no-op',
                        '^all:part:.*': 'sanity-codegen/no-op',
                    },
                },
            ],
            'css-modules-transform',
        ],
    },
};

export default config;