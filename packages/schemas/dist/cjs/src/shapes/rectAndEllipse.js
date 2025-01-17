"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipse = exports.rectangle = void 0;
const common_1 = require("@pdfme/common");
const constants_js_1 = require("../constants.js");
const utils_js_1 = require("../utils.js");
const shape = {
    ui: (arg) => {
        const { schema, rootElement } = arg;
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.boxSizing = 'border-box';
        if (schema.type === 'ellipse') {
            div.style.borderRadius = '50%';
        }
        div.style.borderWidth = `${schema.borderWidth ?? 0}mm`;
        div.style.borderStyle = schema.borderWidth && schema.borderColor ? 'solid' : 'none';
        div.style.borderColor = schema.borderColor ?? 'transparent';
        div.style.backgroundColor = schema.color ?? 'transparent';
        rootElement.appendChild(div);
    },
    pdf: (arg) => {
        const { schema, page, options } = arg;
        if (!schema.color && !schema.borderColor)
            return;
        const { colorType } = options;
        const pageHeight = page.getHeight();
        const cArg = { schema, pageHeight };
        const { position, width, height, rotate, opacity } = (0, utils_js_1.convertForPdfLayoutProps)(cArg);
        const { position: { x: x4Ellipse, y: y4Ellipse }, } = (0, utils_js_1.convertForPdfLayoutProps)({ ...cArg, applyRotateTranslate: false });
        const borderWidth = schema.borderWidth ? (0, common_1.mm2pt)(schema.borderWidth) : 0;
        const drawOptions = {
            rotate,
            borderWidth,
            borderColor: (0, utils_js_1.hex2PrintingColor)(schema.borderColor, colorType),
            color: (0, utils_js_1.hex2PrintingColor)(schema.color, colorType),
            opacity,
            borderOpacity: opacity,
        };
        if (schema.type === 'ellipse') {
            page.drawEllipse({
                x: x4Ellipse + width / 2,
                y: y4Ellipse + height / 2,
                xScale: width / 2 - borderWidth / 2,
                yScale: height / 2 - borderWidth / 2,
                ...drawOptions,
            });
        }
        else if (schema.type === 'rectangle') {
            page.drawRectangle({
                x: position.x + borderWidth / 2,
                y: position.y + borderWidth / 2,
                width: width - borderWidth,
                height: height - borderWidth,
                ...drawOptions,
            });
        }
    },
    propPanel: {
        schema: ({ i18n }) => ({
            borderWidth: {
                title: i18n('schemas.borderWidth'),
                type: 'number',
                widget: 'inputNumber',
                props: { min: 0 },
                step: 1,
            },
            borderColor: {
                title: i18n('schemas.borderColor'),
                type: 'string',
                widget: 'color',
                rules: [{ pattern: constants_js_1.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
            },
            color: {
                title: i18n('schemas.color'),
                type: 'string',
                widget: 'color',
                rules: [{ pattern: constants_js_1.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
            },
        }),
        defaultSchema: {
            type: 'rectangle',
            position: { x: 0, y: 0 },
            width: 62.5,
            height: 37.5,
            rotate: 0,
            opacity: 1,
            borderWidth: 1,
            borderColor: '#000000',
            color: '',
            readOnly: true,
        },
    },
};
const rectangleIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>';
const ellipseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>';
const getPropPanelSchema = (type) => ({
    ...shape.propPanel,
    defaultSchema: {
        ...shape.propPanel.defaultSchema,
        type,
    },
});
exports.rectangle = {
    ...shape,
    propPanel: getPropPanelSchema('rectangle'),
    icon: rectangleIcon
};
exports.ellipse = {
    ...shape,
    propPanel: getPropPanelSchema('ellipse'),
    icon: ellipseIcon
};
//# sourceMappingURL=rectAndEllipse.js.map