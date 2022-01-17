

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <v3Quill
      :toolbar="'full'"
      v-model:value="content"
      height="300px"
      @focus="focus"
      :readOnly="false"
      :handlers="handlers"
      @change="onEditorChange($event)"
      @selectionChange="selectionChange"
      ref="quilldom"
    />
</template>
<script lang="ts">

import { defineComponent, ref, watch, computed, Ref } from "vue";
import { Delta } from "quill";
// import {v3Quill} from "../src/main"
import {v3Quill} from "../dist/index.js"
import  "../dist/style.css"
// import {v3Quill} from "v3-quill"
// import "v3-quill/dist/style.css"
export default defineComponent({
  components: {
    v3Quill,
  },
  data() {
    return {
      toolbars: [
        [{ header: 1 }, { header: 2 }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
      ],
      handlers:{
        image:()=>{
          console.log(111111);
          
        }
      }
    };
  },
  setup() {
    const quilldom=ref(null)
    let content: Ref<Partial<Delta>> = ref({
      ops: [
        { insert: "Delta", attributes: { bold: true } },
        { insert: "是一种富有表现力的数据格式，它是" },
        { insert: "JSON", attributes: { color: "#8955b5", bold: true } },
        {
          insert:
            "的严格子集，Quill用它来描述Quill的文档及其文档的变化，它的链接在这里：",
        },
        {
          insert: "https://quilljs.com/docs/delta",
          attributes: { link: "https://quilljs.com/docs/delta" },
        },
      ],
    });
    const testInputContent = computed(() => {
      return JSON.stringify(content.value);
    });

    function updateQuillContent() {
      content.value = {
        ops: [
          { insert: "这是第二个quill编辑器，" },
          { insert: "吐血警告，不要使用" },
          { insert: "delta", attributes: { color: "#8955b5", bold: true } },
          { insert: "作为quill的content" },
        ],
      };
    }

    watch(
      content,
      () => {
        console.log("[App] delta: ", JSON.stringify(content.value));
      },
      { deep: true }
    );

    function onEditorChange({ quill, html, text }: any) {
      console.log("editor changed! ", quill, html, text);
    }
    function selectionChange(range:any) {
      console.log(range);
      
    }
    function getContent() {
      console.log(content.value);
    }

    const handleTestInput = function (e: Event) {
      console.log("[App] handleTestInput: ");
      content.value = JSON.parse(
        (e.target as HTMLTextAreaElement).value
      );
    };
  function focus(){
    console.log("arguments",arguments);
    
  }
  function getQuill() {
   console.log((quilldom as any).value.getQuill())
  }
    return {
      content,
      testInputContent,
      updateQuillContent,
      onEditorChange,
      getContent,
      handleTestInput,
      focus,
      selectionChange,
      getQuill,
      quilldom
    };
  },
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
