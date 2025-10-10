"use strict";
/**
 * Converte HTML para Portable Text (formato do Sanity)
 *
 * HTML do WordPress → Portable Text do Sanity
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHtmlToPortableText = convertHtmlToPortableText;
exports.textToPortableText = textToPortableText;
var block_tools_1 = require("@sanity/block-tools");
var jsdom_1 = require("jsdom");
var schema_1 = require("@sanity/schema");
// Schema básico do Sanity para blocks
var defaultSchema = schema_1.Schema.compile({
    name: 'default',
    types: [
        {
            type: 'object',
            name: 'block',
            fields: [
                {
                    title: 'Block Type',
                    name: 'style',
                    type: 'string',
                },
                {
                    name: 'children',
                    type: 'array',
                    of: [{ type: 'span' }],
                },
                {
                    name: 'markDefs',
                    type: 'array',
                    of: [{ type: 'object' }],
                },
            ],
        },
        {
            type: 'object',
            name: 'span',
            fields: [
                {
                    name: 'text',
                    type: 'string',
                },
                {
                    name: 'marks',
                    type: 'array',
                    of: [{ type: 'string' }],
                },
            ],
        },
    ],
});
var blockContentType = defaultSchema.get('block');
/**
 * Converte HTML para Portable Text
 * @param html - String HTML (pode conter tags, formatação, etc)
 * @returns Array de blocks do Portable Text
 */
function convertHtmlToPortableText(html) {
    // Se não tiver HTML ou for vazio
    if (!html || html === '0' || html.trim() === '') {
        return [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: '', marks: [] }],
            },
        ];
    }
    try {
        // Limpar HTML comum do WordPress
        var cleanHtml = html
            .replace(/<br\s*\/?>/gi, '\n') // <br> → quebra de linha
            .replace(/<\/p><p>/gi, '\n\n') // </p><p> → parágrafo novo
            .replace(/&nbsp;/gi, ' ') // &nbsp; → espaço
            .replace(/&quot;/gi, '"') // &quot; → "
            .replace(/&amp;/gi, '&') // &amp; → &
            .trim();
        // Se depois de limpar não sobrou nada útil
        if (cleanHtml === '' || cleanHtml === '<p></p>') {
            return [
                {
                    _type: 'block',
                    style: 'normal',
                    children: [{ _type: 'span', text: '', marks: [] }],
                },
            ];
        }
        // Parse com JSDOM
        var dom = new jsdom_1.JSDOM(cleanHtml);
        var bodyEl = dom.window.document.body;
        // Converter para Portable Text
        var blocks = (0, block_tools_1.htmlToBlocks)(bodyEl.innerHTML, blockContentType, {
            parseHtml: function (htmlString) { return new jsdom_1.JSDOM(htmlString).window.document; },
        });
        // Se conversão falhar, fallback para texto simples
        if (!blocks || blocks.length === 0) {
            // Extrair texto puro (sem tags)
            var plainText = bodyEl.textContent || '';
            return plainText
                .split('\n')
                .filter(function (line) { return line.trim(); })
                .map(function (line) { return ({
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: line.trim(), marks: [] }],
            }); });
        }
        return blocks;
    }
    catch (error) {
        console.warn('Erro ao converter HTML para Portable Text:', error);
        // Fallback: texto simples sem formatação
        var plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!plainText) {
            return [
                {
                    _type: 'block',
                    style: 'normal',
                    children: [{ _type: 'span', text: '', marks: [] }],
                },
            ];
        }
        // Quebrar em parágrafos
        return plainText
            .split(/\n+/)
            .filter(function (p) { return p.trim(); })
            .map(function (paragraph) { return ({
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: paragraph.trim(), marks: [] }],
        }); });
    }
}
/**
 * Converte texto simples para Portable Text
 * @param text - String de texto simples
 * @returns Array de blocks do Portable Text
 */
function textToPortableText(text) {
    if (!text || text.trim() === '') {
        return [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: '', marks: [] }],
            },
        ];
    }
    // Quebrar em parágrafos (por linha vazia)
    var paragraphs = text.split(/\n\n+/).filter(function (p) { return p.trim(); });
    if (paragraphs.length === 0) {
        return [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: text.trim(), marks: [] }],
            },
        ];
    }
    return paragraphs.map(function (paragraph) { return ({
        _type: 'block',
        style: 'normal',
        children: [
            {
                _type: 'span',
                text: paragraph.trim(),
                marks: [],
            },
        ],
    }); });
}
