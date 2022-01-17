<template>
  <div class="quill-editor" style="display: flex; flex-direction: column">
    <slot name="toolbar" style="flex-shrink: 0"></slot>
    <div
      ref="editor"
      style="overflow: auto; min-height: 100px; flex: 1"
      :style="{ height: height }"
    ></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref,
  PropType,
  watch,
} from "vue";
// @ts-ignore
import { QuillOptionsStatic, RangeStatic, Sources, Delta } from "quill";
import Quill from "quill"
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { toolbarOptions, ToolbarOptions } from "./until/options";

export type Module = { name: string; module: any; options?: object };

export default defineComponent({
  name: "vue3QuillEdit",
  props: {
    content: {
      type: String,
    },
    value: {
      type: Object,
    },
    contentType: {
      type: String as PropType<"delta" | "html" | "text">,
      default: "delta",
      validator: (value: string) => {
        return ["delta", "html", "text"].includes(value);
      },
    },
    enable: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    theme: {
      type: String as PropType<"snow" | "bubble" | "">,
      default: "snow",
      validator: (value: string) => {
        return ["snow", "bubble", ""].includes(value);
      },
    },
    toolbar: {
      type: [String, Array, Object],
      required: false,
      validator: (value: string | unknown) => {
        if (typeof value === "string" && value !== "") {
          return value.charAt(0) === "#"
            ? true
            : Object.keys(toolbarOptions).indexOf(value) !== -1;
        }
        return true;
      },
    },
    handlers: {
      type: Object,
      require: false,
    },
    modules: {
      type: Object as PropType<Module | Module[]>,
      required: false,
    },
    options: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
    },
    globalOptions: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
    },
    height: {
      type: String,
      required: false,
      default: "auto",
    },
  },
  emits: [
    "blur",
    "focus",
    "update:value",
    "change",
    "ready",
    "selectionChange",
    "editorChange",
  ],
  setup(props, { emit }) {
    let quill: Quill | null;
    let options: QuillOptionsStatic;
    const editor = ref<HTMLDivElement | string>();
    let controlSource = "api"; // delta变更源，默认无焦点，应该是api
    let height = props.height;
    onBeforeUnmount(() => {
      quill = null;
    });
    onMounted(() => {
      init();
    });

    function init() {
      if (!editor.value) return;
      options = composeOptions();

      // Register modules
      if (props.modules) {
        if (Array.isArray(props.modules)) {
          for (const module of props.modules) {
            Quill.register(`modules/${module.name}`, module.module);
          }
        } else {
          Quill.register(`modules/${props.modules.name}`, props.modules.module);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      quill = new Quill(editor.value!, options);
      const toolbar = quill.getModule("toolbar");
      // toolbar.addHandler("image", ()=>{
      //   console.log(121212)
      //    /*内存创建input file*/
      //   var input = document.createElement('input');
      //   input.type = 'file';
      //   input.name = "fileName";
      //   input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
      //   input.onchange = (files)=>{
      //     console.log(files);
          
      //   };
      //   input.click()
      // });
      if (props.handlers) {
        if (typeof props.handlers === "object") {
          for (const key in props.handlers) {
            if (Object.prototype.hasOwnProperty.call(props.handlers, key)) {
              toolbar.addHandler(key, (props.handlers as any)[key]);
            }
          }
        }
      }
      // Remove editor class when theme changes
      if (props.theme !== "bubble")
        (editor.value as HTMLDivElement).classList.remove("ql-bubble");
      if (props.theme !== "snow")
        (editor.value as HTMLDivElement).classList.remove("ql-snow");

      if (props.value) {
        quill.setContents(props.value as Delta);
      }

      // Disabled editor
      if (!props.enable) {
        quill.enable(true);
      }
      // Set event handlers
      quill.on(
        "text-change",
        (delta: Delta, oldDelta: Delta, source: string) => {
          controlSource = source;
          // console.log("[index/event] text changed: ", delta, oldDelta, source);
          // https://quilljs.com/docs/api/#text-change
          // source 是api类型的内容变更不用上报，只是不用上报，但是可以干别的，因为api源
          // 的变更目前只可能是上层组件传下来导致发生的变更，这里只上报user源的
          // !!!这里的source一定比watch props.value时的source更新鲜！！！
          if (source === "user") {
            if (quill) {
              emit("update:value", quill.getContents());
            }
          }
        }
      );

      quill.on(
        "selection-change",
        (range: RangeStatic, oldRange: RangeStatic, source: Sources) => {
          if (!range) {
            // 失去焦点了，把变更源交给api
            controlSource = "api";
            // console.log("[index/selection-change] switch controlSource to api");
            emit("blur", quill);
          } else {
            // 获得焦点了，把变更元交给user
            controlSource = "user";
            // console.log(
            //   "[index/selection-change] switch controlSource to user"
            // );
            emit("focus", quill);
          }
          emit("selectionChange", { range, oldRange, source });
        }
      );

      // 编辑内容发生变化时
      quill.on(
        "editor-change",
        (
          ...args:
            | [
                name: "text-change",
                delta: Delta,
                oldContents: Delta,
                source: Sources
              ]
            | [
                name: "selection-change",
                range: RangeStatic,
                oldRange: RangeStatic,
                source: Sources
              ]
        ) => {
          if (args[0] === "text-change")
            emit("editorChange", {
              name: args[0],
              delta: args[1],
              oldContents: args[2],
              source: args[3],
            });
          if (args[0] === "selection-change")
            emit("editorChange", {
              name: args[0],
              range: args[1],
              oldRange: args[2],
              source: args[3],
            });
        }
      );
      quill.getModule("toolbar")
        ? quill
            .getModule("toolbar")
            .container.addEventListener("mousedown", (e: MouseEvent) => {
              e.preventDefault();
            })
        : "";

      // Emit ready event
      emit("ready", quill);
    }

    function composeOptions(): QuillOptionsStatic {
      const clientOptions: QuillOptionsStatic = {};
      if (props.theme !== "") clientOptions.theme = props.theme;
      if (props.readOnly) clientOptions.readOnly = props.readOnly;
      if (props.placeholder) clientOptions.placeholder = props.placeholder;
      if (props.toolbar && props.toolbar !== "") {
        clientOptions.modules = {
          toolbar: (() => {
            if (typeof props.toolbar === "object") {
              return props.toolbar;
            } else if (typeof props.toolbar === "string") {
              const str = props.toolbar as string;
              return str.charAt(0) === "#"
                ? props.toolbar
                : toolbarOptions[props.toolbar as keyof ToolbarOptions];
            }
            return;
          })(),
        };
      }

      if (props.modules) {
        const modules = (() => {
          const modulesOption: { [key: string]: any } = {};
          if (Array.isArray(props.modules)) {
            for (const module of props.modules) {
              modulesOption[module.name] = module.options ? module.options : {};
            }
          } else {
            modulesOption[props.modules.name] = props.modules.options
              ? props.modules.options
              : {};
          }
          return modulesOption;
        })();
        Object.assign(clientOptions.modules, modules);
      }
      return Object.assign(
        {},
        props.globalOptions,
        props.options,
        clientOptions
      );
    }

    const getQuill = (): Quill => {
      if (quill) return quill;
      else
        throw `The quill editor hasn't been instantiated yet, 
                  make sure to call this method when the editor ready
                  or use v-on:ready="onReady(quill)" event instead.`;
    };

    watch(
      () => props.value,
      (newVal, oldVal) => {
        // 用户输入在quill编辑器上输入产生的数据变化，此变化对于quill来说，它是一手资料来源，
        // 不用同步给它。
        if (controlSource === "user") {
          return;
        }
        // console.log("[index] value changed to: ", props.value);
        if (quill) {
          // 这里只当成source是api的方式来处理，因为用户在quill上的编辑操作产生
          // 的user source不需要监控，只要user source的操作能报告上去就行
          quill.setContents(newVal as Delta);
        }
      },
      { deep: true }
    );
    watch(
      () => props.enable,
      (newValue) => {
        if (quill) quill.enable(newValue);
      }
    );

    return {
      editor,
      height,
      getQuill,
    };
  },
});
</script>
