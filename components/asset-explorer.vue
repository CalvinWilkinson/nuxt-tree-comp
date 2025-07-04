<script setup lang="ts">
import { node } from "@primeuix/themes/aura/organizationchart";
import type { FileObject, FileObjectV2 } from "@supabase/storage-js";
import type { TreeNode } from "primevue/treenode";
import { ref, onMounted } from "vue";
import type { FolderItem } from "~/core/data/folder-item";
import type { SupaItem } from "~/core/data/models/supabase/supa-item";

// const nodes = ref<TreeNode[] | undefined>(undefined);
const isLoading = ref(false);

// Direct useLazyFetch call with unique key
const { data: folderData, pending, refresh } = await useLazyFetch<FolderItem[]>("/api/folders", {
    server: true,
    cache: "no-cache",
    default: () => []
});

// Computed property to transform data into TreeNode format
let nodes = ref<TreeNode[]>([]);

nodes.value = folderData.value.map((item, index) => {
    return {
        key: index.toString(),
        label: item.name,
        leaf: !item.hasChildren,
        loading: isLoading.value,
        icon: "pi pi-folder"
    };
});

const onNodeExpand = async (node: TreeNode) => {
    if (!node.children) {
        let _node = { ...node };

        node.loading = true;

        const foldersUrl = `/api/folders?folderPath=${node.label}`;

        const folders = await $fetch<FolderItem[]>(foldersUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });
        
        const filesUrl = `/api/files?folderPath=${node.label}`;

        const files = await $fetch<FolderItem[]>(filesUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });

        // Add the folders as children of the node
        _node.children = folders.map((folder, index) => ({
            key: index.toString(),
            label: folder.name,
            leaf: !folder.hasChildren,
            loading: false,
            icon: "pi pi-folder"
        }));

        // Add the files as children of the node
        const fileNodes = files.map((file, index) => ({
            key: index.toString(),
            label: file.name,
            leaf: true,
            loading: false,
            icon: "pi pi-file"
        }));

        _node.children.push(...fileNodes);

        const index = parseInt(_node.key, 10);
        nodes.value[index] = { ..._node, loading: false };
    }
};

const handleClick = async () => {
    await refresh();
    // Reset nodes to trigger re-render
    nodes.value = folderData.value.map((item, index) => {
        return {
            key: index.toString(),
            label: item.name,
            leaf: !item.hasChildren,
            loading: isLoading.value,
            icon: "pi pi-folder"
        };
    });
};

</script>


<template>
    <div class="card flex flex-wrap gap-4">
        <div class="flex-auto md:flex md:justify-start md:items-center flex-col">
            <label class="font-bold block mb-2">Icon Mode</label>
            <Tree :value="nodes" @node-expand="onNodeExpand" loadingMode="icon" class="w-full md:w-[30rem]" />

            <Button label="Refresh" @click="handleClick" />
        </div>
    </div>
</template>
