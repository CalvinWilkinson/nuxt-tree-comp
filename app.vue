<script setup lang="ts">
import type { TreeNode } from "primevue/treenode";
import type { FileItem } from "./core/data/file-item";
import { decodeValue } from "./core/utils/encoding";
import type { FolderItem } from "./core/data/folder-item";
import { isFileItem, isFolderItem } from "./core/utils/type-guards";
import type { MenuItem } from "primevue/menuitem";

const currentImgPath = ref<string>("");

// Define the callback function
const handleNodeSelected = (selectedItem: FolderItem | FileItem) => {
    if (isFileItem(selectedItem)) {
        currentImgPath.value = selectedItem.url;
    }
};

const handleOnRename = (item: MenuItem) => {
    console.log("On Rename Clicked:", item.label);
};

const handleOnDelete = (item: MenuItem) => {
    console.log("On Delete Clicked:", item.label);
};

</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <AssetExplorer :on-node-selected="handleNodeSelected" />

        <Image :src="currentImgPath" />
    </div>
</template>
