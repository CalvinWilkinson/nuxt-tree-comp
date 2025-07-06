<script setup lang="ts">
import type { TreeNode } from "primevue/treenode";
import type { FileItem } from "./core/data/file-item";
import { decodeValue } from "./core/utils/encoding";
import type { FolderItem } from "./core/data/folder-item";
import { isFileItem, isFolderItem } from "./core/utils/type-guards";
import type { MenuItem } from "primevue/menuitem";

import { ref } from "vue";
import type { RenameDialog } from "#components";

const currentImgPath = ref<string>("");
const dialogRef = ref<InstanceType<typeof RenameDialog> | null>(null);

// Define the callback function
const handleNodeSelected = (selectedItem: FolderItem | FileItem) => {
    if (isFileItem(selectedItem)) {
        console.log(selectedItem.url);
        currentImgPath.value = selectedItem.url;
    }
};

const handleDialogOpen = () => {
    if (dialogRef.value) {
        dialogRef.value.open();
    }
}

</script>



<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>

    <div class="flex flex-col justify-center items-center">
        <AssetExplorer :on-node-selected="handleNodeSelected" />

        <Image :src="currentImgPath" />

        <Button label="Show" @click="handleDialogOpen" />
    </div>
</template>





<script setup lang="ts">
</script>



<template>

</template>
