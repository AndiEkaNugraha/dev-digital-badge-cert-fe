"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const generate_1 = __importDefault(require("../src/generate"));
const common_1 = require("@pdfme/common");
const utils_1 = require("./utils");
describe('generate integrate test', () => {
    describe('basic generator', () => {
        const textObject = (x, y) => ({
            type: 'text',
            content: '',
            position: { x, y },
            width: 100,
            height: 100,
            fontSize: 13,
        });
        const singleSchemaTemplate = {
            basePdf: common_1.BLANK_PDF,
            schemas: [
                {
                    a: textObject(0, 0),
                    b: textObject(25, 25),
                },
            ],
        };
        const multiSchemasTemplate = {
            basePdf: 'data:application/pdf;base64,JVBERi0xLjcNJeLjz9MNCjYgMCBvYmoNPDwvTGluZWFyaXplZCAxL0wgMTg0NC9PIDgvRSAxMTEwL04gMi9UIDE1NzAvSCBbIDQyMyAxMzFdPj4NZW5kb2JqDSAgICAgICAgICAgICAgICAgICAgICAgDQoxMSAwIG9iag08PC9EZWNvZGVQYXJtczw8L0NvbHVtbnMgMy9QcmVkaWN0b3IgMTI+Pi9GaWx0ZXIvRmxhdGVEZWNvZGUvSURbPEJBMTk5MUY0MThCN0IyMTEwQTAwNjc0NThCNkJDNjIzPjxGOEE4OEZEMzMzNjQ2OTQ2QkE1ODMzM0M4MEFEMDFFNj5dL0luZGV4WzYgN10vTGVuZ3RoIDM2L1ByZXYgMTU3MS9Sb290IDcgMCBSL1NpemUgMTMvVHlwZS9YUmVmL1dbMSAyIDBdPj5zdHJlYW0NCmjeYmJkEGBiYJJiYmDQZWJgvA+k45gY/j4Aso0BAgwAISQDuA0KZW5kc3RyZWFtDWVuZG9iag1zdGFydHhyZWYNCjANCiUlRU9GDQogICAgICAgIA0KMTIgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA1Ny9TIDQ0Pj5zdHJlYW0NCmjeYmBgYGJgYLzCwAgkbRk4GBCAAyjGxMDCwNFwiOGAQvkhJCkGZihmYIhj4GhkSGEACDAAvy4F4g0KZW5kc3RyZWFtDWVuZG9iag03IDAgb2JqDTw8L1BhZ2VzIDUgMCBSL1R5cGUvQ2F0YWxvZz4+DWVuZG9iag04IDAgb2JqDTw8L0Fubm90c1tdL0JsZWVkQm94WzAgMCA1OTUuNDQgODQxLjkyXS9Db250ZW50cyA5IDAgUi9Dcm9wQm94WzAgMCA1OTUuNDQgODQxLjkyXS9NZWRpYUJveFswIDAgNTk1LjQ0IDg0MS45Ml0vUGFyZW50IDUgMCBSL1Jlc291cmNlczw8L1hPYmplY3Q8PC9GbTAgMTAgMCBSPj4+Pi9Sb3RhdGUgMC9UcmltQm94WzAgMCA1OTUuNDQgODQxLjkyXS9UeXBlL1BhZ2U+Pg1lbmRvYmoNOSAwIG9iag08PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDI2Pj5zdHJlYW0NCkiJKlQwUAjx0XfLNVBwyVcIVAAIMAAiagP4DQplbmRzdHJlYW0NZW5kb2JqDTEwIDAgb2JqDTw8L0JCb3hbMzI3NjguMCAzMjc2OC4wIC0zMjc2OC4wIC0zMjc2OC4wXS9GaWx0ZXIvRmxhdGVEZWNvZGUvRm9ybVR5cGUgMS9MZW5ndGggMTQvTWF0cml4WzEgMCAwIDEgMCAwXS9SZXNvdXJjZXM8PD4+L1N1YnR5cGUvRm9ybS9UeXBlL1hPYmplY3Q+PnN0cmVhbQ0KSIkq5ArkAggwAAKSANcNCmVuZHN0cmVhbQ1lbmRvYmoNMSAwIG9iag08PC9Bbm5vdHNbXS9CbGVlZEJveFswIDAgNTk1LjQ0IDg0MS45Ml0vQ29udGVudHMgMiAwIFIvQ3JvcEJveFswIDAgNTk1LjQ0IDg0MS45Ml0vTWVkaWFCb3hbMCAwIDU5NS40NCA4NDEuOTJdL1BhcmVudCA1IDAgUi9SZXNvdXJjZXM8PC9YT2JqZWN0PDwvRm0wIDEwIDAgUj4+Pj4vUm90YXRlIDAvVHJpbUJveFswIDAgNTk1LjQ0IDg0MS45Ml0vVHlwZS9QYWdlPj4NZW5kb2JqDTIgMCBvYmoNPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCAyNj4+c3RyZWFtDQpIiSpUMFAI8dF3yzVQcMlXCFQACDAAImoD+A0KZW5kc3RyZWFtDWVuZG9iag0zIDAgb2JqDTw8L0ZpbHRlci9GbGF0ZURlY29kZS9GaXJzdCA0L0xlbmd0aCA1Mi9OIDEvVHlwZS9PYmpTdG0+PnN0cmVhbQ0KaN4yVTBQsLHRd84vzStRMNL3zkwpjrYAigUpGILIWP2QyoJU/YDE9NRiOzuAAAMAETgMkw0KZW5kc3RyZWFtDWVuZG9iag00IDAgb2JqDTw8L0RlY29kZVBhcm1zPDwvQ29sdW1ucyAzL1ByZWRpY3RvciAxMj4+L0ZpbHRlci9GbGF0ZURlY29kZS9JRFs8QkExOTkxRjQxOEI3QjIxMTBBMDA2NzQ1OEI2QkM2MjM+PEY4QTg4RkQzMzM2NDY5NDZCQTU4MzMzQzgwQUQwMUU2Pl0vTGVuZ3RoIDMzL1Jvb3QgNyAwIFIvU2l6ZSA2L1R5cGUvWFJlZi9XWzEgMiAwXT4+c3RyZWFtDQpo3mJiYGBgYmQJY2JgvM/EwBAHpCcwMf56ABBgABstBBINCmVuZHN0cmVhbQ1lbmRvYmoNc3RhcnR4cmVmDQoxMTYNCiUlRU9GDQo=',
            schemas: [{ a: textObject(0, 0) }, { b: textObject(25, 25) }],
        };
        const singleInputs = [{ a: 'a', b: 'b' }];
        const multiInputs = [
            { a: 'a-1', b: 'b-1' },
            { a: 'a-2', b: 'b-2' },
        ];
        const testCases = [
            {
                template: singleSchemaTemplate,
                inputs: singleInputs,
                testName: 'singleSchemaTemplate with singleInputs',
            },
            {
                template: singleSchemaTemplate,
                inputs: multiInputs,
                testName: 'singleSchemaTemplate with multiInputs',
            },
            {
                template: multiSchemasTemplate,
                inputs: singleInputs,
                testName: 'multiSchemasTemplate with singleInputs',
            },
            {
                template: multiSchemasTemplate,
                inputs: multiInputs,
                testName: 'multiSchemasTemplate with multiInputs',
            },
        ];
        // testCases for
        for (let i = 0; i < testCases.length; i += 1) {
            const { template, inputs, testName } = testCases[i];
            // eslint-disable-next-line no-loop-func
            test(testName, async () => {
                const pdf = await (0, generate_1.default)({ inputs, template });
                const tmpFile = (0, utils_1.getPdfTmpPath)(`${testName}.pdf`);
                const assertFile = (0, utils_1.getPdfAssertPath)(`${testName}.pdf`);
                (0, fs_1.writeFileSync)(tmpFile, pdf);
                const [actualPdf, expectedPdf] = await Promise.all([(0, utils_1.getPdf)(tmpFile), (0, utils_1.getPdf)(assertFile)]);
                // @ts-ignore
                expect(actualPdf.Pages).toEqual(expectedPdf.Pages);
            });
        }
    });
    describe('use fontColor template', () => {
        test(`sample`, async () => {
            const inputs = [{ name: 'here is purple color' }];
            const template = {
                basePdf: common_1.BLANK_PDF,
                schemas: [
                    {
                        name: {
                            type: 'text',
                            content: '',
                            position: { x: 30, y: 30 },
                            width: 100,
                            height: 20,
                            fontColor: '#7d2ae8',
                        },
                    },
                ],
            };
            const pdf = await (0, generate_1.default)({ inputs, template });
            const tmpFile = (0, utils_1.getPdfTmpPath)(`fontColor.pdf`);
            const assertFile = (0, utils_1.getPdfAssertPath)(`fontColor.pdf`);
            (0, fs_1.writeFileSync)(tmpFile, pdf);
            const res = await Promise.all([(0, utils_1.getPdf)(tmpFile), (0, utils_1.getPdf)(assertFile)]);
            const [a, e] = res;
            expect(a.Pages).toEqual(e.Pages);
        });
    });
    describe('use fontSubset template', () => {
        test(`sample`, async () => {
            const inputs = [{ field1: 'SauceHanSansJP', field2: 'SauceHanSerifJP' }];
            const template = {
                basePdf: common_1.BLANK_PDF,
                schemas: [
                    {
                        field1: {
                            type: 'text',
                            content: '',
                            position: { x: 30, y: 30 },
                            width: 100,
                            height: 20,
                            fontName: 'SauceHanSansJP',
                        },
                        field2: {
                            type: 'text',
                            content: '',
                            position: { x: 60, y: 60 },
                            width: 100,
                            height: 20,
                            fontName: 'SauceHanSerifJP',
                        },
                    },
                ],
            };
            jest.setTimeout(30000);
            const { SauceHanSansJP, SauceHanSerifJP } = (0, utils_1.getFont)();
            const pdf = await (0, generate_1.default)({
                inputs,
                template,
                options: {
                    font: {
                        SauceHanSansJP: {
                            data: SauceHanSansJP.data,
                            fallback: true,
                            subset: false,
                        },
                        SauceHanSerifJP: {
                            data: SauceHanSerifJP.data,
                            subset: false,
                        },
                    },
                },
            });
            const tmpFile = (0, utils_1.getPdfTmpPath)(`fontSubset.pdf`);
            const assertFile = (0, utils_1.getPdfAssertPath)(`fontSubset.pdf`);
            (0, fs_1.writeFileSync)(tmpFile, pdf);
            const res = await Promise.all([(0, utils_1.getPdf)(tmpFile), (0, utils_1.getPdf)(assertFile)]);
            const [a, e] = res;
            expect(a.Pages).toEqual(e.Pages);
        }, 10000);
    });
});
describe('check validation', () => {
    test(`inputs length is 0`, async () => {
        const inputs = [];
        const template = {
            basePdf: common_1.BLANK_PDF,
            schemas: [
                {
                    a: {
                        type: 'text',
                        content: '',
                        position: { x: 0, y: 0 },
                        width: 100,
                        height: 100,
                    },
                },
            ],
        };
        try {
            await (0, generate_1.default)({ inputs, template, options: { font: (0, utils_1.getFont)() } });
            fail();
        }
        catch (e) {
            expect(e.message).toEqual(`[common] Invalid argument:
--------------------------
ERROR POSITION: inputs
ERROR MESSAGE: Array must contain at least 1 element(s)
--------------------------`);
        }
    });
    test(`missing fallback font`, async () => {
        const inputs = [{ a: 'test' }];
        const template = {
            basePdf: common_1.BLANK_PDF,
            schemas: [
                {
                    a: {
                        type: 'text',
                        content: '',
                        position: { x: 0, y: 0 },
                        width: 100,
                        height: 100,
                    },
                },
            ],
        };
        const font = (0, utils_1.getFont)();
        font.SauceHanSansJP.fallback = false;
        font.SauceHanSerifJP.fallback = false;
        try {
            await (0, generate_1.default)({ inputs, template, options: { font } });
            fail();
        }
        catch (e) {
            expect(e.message).toEqual(`[@pdfme/common] fallback flag is not found in font. true fallback flag must be only one.
Check this document: https://pdfme.com/docs/custom-fonts#about-font-type`);
        }
    });
    test(`too many fallback font`, async () => {
        const inputs = [{ a: 'test' }];
        const template = {
            basePdf: common_1.BLANK_PDF,
            schemas: [
                {
                    a: {
                        type: 'text',
                        content: '',
                        position: { x: 0, y: 0 },
                        width: 100,
                        height: 100,
                    },
                },
            ],
        };
        const font = (0, utils_1.getFont)();
        font.SauceHanSansJP.fallback = true;
        font.SauceHanSerifJP.fallback = true;
        try {
            await (0, generate_1.default)({ inputs, template, options: { font } });
            fail();
        }
        catch (e) {
            expect(e.message).toEqual(`[common] 2 fallback flags found in font. true fallback flag must be only one.`);
        }
    });
    test(`missing font in template.schemas`, async () => {
        const inputs = [{ a: 'test' }];
        const template = {
            basePdf: common_1.BLANK_PDF,
            schemas: [
                {
                    a: {
                        type: 'text',
                        content: '',
                        fontName: 'SauceHanSansJP2',
                        position: { x: 0, y: 0 },
                        width: 100,
                        height: 100,
                    },
                    b: {
                        type: 'text',
                        content: '',
                        position: { x: 0, y: 0 },
                        width: 100,
                        height: 100,
                    },
                },
            ],
        };
        try {
            await (0, generate_1.default)({ inputs, template, options: { font: (0, utils_1.getFont)() } });
            fail();
        }
        catch (e) {
            expect(e.message).toEqual(`[common] SauceHanSansJP2 of template.schemas is not found in font.`);
        }
    });
});
//# sourceMappingURL=generate.test.js.map