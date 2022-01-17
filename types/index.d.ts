// @ts-ignore
import vue3QuillEdit from './dist/index.js';
declare const Quill: any;
declare const install: (Vue: any) => void;
declare const VueQuillEditor: {
    Quill: any;
    vue3QuillEdit: import("vue").DefineComponent<{}, {}, any, Record<string, import("vue").ComputedGetter<any> | import("vue").WritableComputedOptions<any>>, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{} & {} & {}>, {}>;
    install: (Vue: any) => void;
};
export default VueQuillEditor;
export { Quill, vue3QuillEdit, install };
