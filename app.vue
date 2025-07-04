<script setup lang="ts">
import type { TreeNode } from "primevue/treenode";
import type { FileItem } from "./core/data/file-item";
import { decodeValue } from "./core/utils/encoding";
import type { FolderItem } from "./core/data/folder-item";
import { isFileItem, isFolderItem } from "./core/utils/type-guards";

const currentImgPath = ref<string>("");

// Define the callback function
const handleNodeSelected = (selectedItem: FolderItem | FileItem) => {
    if (isFileItem(selectedItem)) {
        currentImgPath.value = selectedItem.url;
        console.log(currentImgPath.value);
    }
};
</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <AssetExplorer :on-node-selected="handleNodeSelected" />

        <Image :src="currentImgPath" />
    </div>
</template>
