import { PropType } from "vue";
import { QuillOptionsStatic } from "quill";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export declare type Module = {
    name: string;
    module: any;
    options?: object;
};
declare const _default: import("vue").DefineComponent<{
    content: {
        type: StringConstructor;
    };
    value: {
        type: ObjectConstructor;
    };
    contentType: {
        type: PropType<"delta" | "html" | "text">;
        default: string;
        validator: (value: string) => boolean;
    };
    enable: {
        type: BooleanConstructor;
        default: boolean;
    };
    readOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    placeholder: {
        type: StringConstructor;
        required: false;
    };
    theme: {
        type: PropType<"" | "snow" | "bubble">;
        default: string;
        validator: (value: string) => boolean;
    };
    toolbar: {
        type: (StringConstructor | ObjectConstructor | ArrayConstructor)[];
        required: false;
        validator: (value: string | unknown) => boolean;
    };
    handlers: {
        type: ObjectConstructor;
        require: boolean;
    };
    modules: {
        type: PropType<Module | Module[]>;
        required: false;
    };
    options: {
        type: PropType<QuillOptionsStatic>;
        required: false;
    };
    globalOptions: {
        type: PropType<QuillOptionsStatic>;
        required: false;
    };
    height: {
        type: StringConstructor;
        required: false;
        default: string;
    };
}, {
    editor: import("vue").Ref<string | HTMLDivElement | undefined>;
    height: string;
    getQuill: () => Quill;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("blur" | "focus" | "update:value" | "change" | "ready" | "selectionChange" | "editorChange")[], "blur" | "focus" | "update:value" | "change" | "ready" | "selectionChange" | "editorChange", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    content?: unknown;
    value?: unknown;
    contentType?: unknown;
    enable?: unknown;
    readOnly?: unknown;
    placeholder?: unknown;
    theme?: unknown;
    toolbar?: unknown;
    handlers?: unknown;
    modules?: unknown;
    options?: unknown;
    globalOptions?: unknown;
    height?: unknown;
} & {
    contentType: "delta" | "html" | "text";
    enable: boolean;
    readOnly: boolean;
    theme: "" | "snow" | "bubble";
    height: string;
} & {
    content?: string | undefined;
    value?: Record<string, any> | undefined;
    placeholder?: string | undefined;
    toolbar?: string | unknown[] | Record<string, any> | undefined;
    handlers?: Record<string, any> | undefined;
    modules?: Module | Module[] | undefined;
    options?: QuillOptionsStatic | undefined;
    globalOptions?: QuillOptionsStatic | undefined;
}> & {
    onBlur?: ((...args: any[]) => any) | undefined;
    onFocus?: ((...args: any[]) => any) | undefined;
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    onReady?: ((...args: any[]) => any) | undefined;
    onSelectionChange?: ((...args: any[]) => any) | undefined;
    onEditorChange?: ((...args: any[]) => any) | undefined;
}, {
    contentType: "delta" | "html" | "text";
    enable: boolean;
    readOnly: boolean;
    theme: "" | "snow" | "bubble";
    height: string;
}>;
export default _default;
