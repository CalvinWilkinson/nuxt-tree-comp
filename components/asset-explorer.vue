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
        key: item.name, // Use the folder name as the key (root level path)
        label: item.name,
        leaf: !item.hasChildren,
        loading: isLoading.value,
        icon: "pi pi-folder"
    };
});

const findParentNode = (targetNode: TreeNode, currentNodes: TreeNode[], parent: TreeNode | null = null): TreeNode | null => {
    for (const node of currentNodes) {
        if (node.key === targetNode.key) {
            return parent;
        }

        if (node.children) {
            const foundParent = findParentNode(targetNode, node.children, node);

            if (foundParent) {
                return foundParent;
            }
        }
    }

    return null;
};

const onNodeSelect = (node: TreeNode) => {
    if (parent) {
        console.log("Parent node:", parent.label);
    } else {
        console.log("This is a root node");
    }
};

const onNodeExpand = async (node: TreeNode) => {
    if (!node.children) {
        let _node = { ...node };

        node.loading = true;

        const foldersUrl = `/api/folders?folderPath=${node.key}`;

        const folders = await $fetch<FolderItem[]>(foldersUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });

        const filesUrl = `/api/files?folderPath=${node.key}`;

        const files = await $fetch<FolderItem[]>(filesUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });

        // Add the folders as children of the node
        node.children = folders.map((folder, index) => ({
            key: `${node.key}/${folder.name}`, // Use full path as key
            label: folder.name,
            leaf: !folder.hasChildren,
            loading: false,
            icon: "pi pi-folder",
        }));

        // Add the files as children of the node
        node.children = [...node.children, ...files.map((file, index) => ({
            key: `${node.key}/${file.name}`, // Use full path as key
            label: file.name,
            leaf: true,
            loading: false,
            icon: "pi pi-file",
        }))];

        node.loading = false;
    }
};

const handleClick = async () => {
    await refresh();
    // Reset nodes to trigger re-render
    nodes.value = folderData.value.map((item, index) => {
        return {
            key: item.name, // Use the folder name as the key (root level path)
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
            <Tree :value="nodes" loadingMode="icon" class="w-full md:w-[30rem]" selection-mode="single"
                @node-expand="onNodeExpand" @node-select="onNodeSelect" />

            <Button label="Refresh" @click="handleClick" />
        </div>
    </div>
</template>
