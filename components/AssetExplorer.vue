<script setup lang="ts">
import type { RenameDialog } from "#components";
import type { FileObject, FileObjectV2 } from "@supabase/storage-js";
import type { TreeNode } from "primevue/treenode";
import { ref, onMounted } from "vue";
import type { FileItem } from "~/core/data/file-item";
import type { FolderItem } from "~/core/data/folder-item";
import type { SupaItem } from "~/core/data/models/supabase/supa-item";
import { decodeValue, encodeValue } from "~/core/utils/encoding";
import { isFolderItem } from "~/core/utils/type-guards";

// Define props including the callback
interface Props {
    onNodeSelected?: (item: FolderItem | FileItem) => void;
}

const props = defineProps<Props>();

// const nodes = ref<TreeNode[] | undefined>(undefined);
const isLoading = ref(false);
const selectedKeys = ref<Record<string, boolean>>({});

// Direct useLazyFetch call with unique key
const { data: folderData, pending, refresh } = await useLazyFetch<FolderItem[]>("/api/folders", {
    server: true,
    cache: "no-cache",
    default: () => []
});

// Computed property to transform data into TreeNode format
let nodes = ref<TreeNode[]>([]);

const getFolderOrFileItem = (node: TreeNode): FolderItem | FileItem => {
    const decodedKeyResult = decodeValue(node.key);

    if (decodedKeyResult.isErr()) {
        throw new Error("Failed to decode TreeNode key");
    }

    const selectedItem: FolderItem | FileItem = JSON.parse(decodedKeyResult.value);

    return selectedItem;
};

const toNode = (item: FolderItem | FileItem): TreeNode => {
    const keyResult = encodeValue(JSON.stringify(item));

    if (keyResult.isErr()) {
        console.error("Error encoding item key:", keyResult.error);
        return {
            key: "", // Skip this item if encoding fails
            label: item.name,
            leaf: true,
            loading: isLoading.value,
            icon: "pi pi-file",
        };
    }

    return {
        key: keyResult.value, // Use full path as key
        label: item.name,
        leaf: "hasChildren" in item ? !item.hasChildren : true,
        loading: isLoading.value,
        icon: isFolderItem(item) ? "pi pi-folder" : "pi pi-file",
    };
};

nodes.value = folderData.value.map((item, index) => {
    return toNode(item);
});

const onNodeSelect = (node: TreeNode) => {
    const selectedItem = getFolderOrFileItem(node);

    props.onNodeSelected?.(selectedItem);
};

const onNodeExpand = async (node: TreeNode) => {
    if (!node.children) {
        node.loading = true;

        const folderOrFileItem = getFolderOrFileItem(node);

        const foldersUrl = `/api/folders?folderPath=${folderOrFileItem.path}`;

        const folders = await $fetch<FolderItem[]>(foldersUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });

        const filesUrl = `/api/files?folderPath=${folderOrFileItem.path}`;

        const files = await $fetch<FileItem[]>(filesUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });

        // Add the folders as children of the node
        node.children = folders.map((folder, index) => {
            return toNode(folder);
        });

        // Add the files as children of the node
        node.children = [...node.children, ...files.map((file, index) => {
            return toNode(file);
        })];

        node.loading = false;
    }
};

const handleRefresh = async () => {
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

// Function to refresh a specific node in the tree
const refreshNode = async (nodeKey: string, oldPath: string, newPath: string) => {
    // Find the node in the tree by traversing the tree structure
    const findAndUpdateNode = async (nodes: TreeNode[], targetKey: string): Promise<boolean> => {
        for (const node of nodes) {
            if (node.key === targetKey) {
                try {
                    // Fetch the updated item data
                    const updatedItem = await $fetch<FolderItem | FileItem>(`/api/item?itemPath=${newPath}`);
                    if (updatedItem) {
                        // Update the node with new data
                        node.label = updatedItem.name;
                        const newNodeKey = encodeValue(JSON.stringify(updatedItem));
                        if (newNodeKey.isOk()) {
                            node.key = newNodeKey.value;
                        }
                    }
                } catch (error) {
                    console.error("Failed to refresh node:", error);
                }
                return true;
            }
            
            // Recursively search in children
            if (node.children && await findAndUpdateNode(node.children, targetKey)) {
                return true;
            }
        }
        return false;
    };

    await findAndUpdateNode(nodes.value, nodeKey);
};

// Expose the refresh function so it can be called from child components
defineExpose({
    refreshNode
});

</script>



<template>
    <div class="card flex flex-wrap gap-4">
        <div class="flex-auto md:flex md:justify-start md:items-center flex-col">
            <label class="font-bold block mb-2">Icon Mode</label>
            <Tree :value="nodes" 
                  v-model:selectionKeys="selectedKeys" 
                  loadingMode="icon" 
                  class="w-full md:w-[30rem]" 
                  selection-mode="single"
                  @node-expand="onNodeExpand" 
                  @node-select="onNodeSelect">
                <template #default="slotProps">
                    <FolderFileMenu :label="slotProps.node.label ?? 'no-label-set'"
                        :item="getFolderOrFileItem(slotProps.node)" 
                        :on-rename-success="(oldPath: string, newPath: string) => refreshNode(slotProps.node.key, oldPath, newPath)" />

                    <!-- <div>
                        <label class="ml-1">{{ slotProps.node.label }}</label>
                        <Button icon="pi pi-ellipsis-v" variant="text" raised rounded aria-label="Filter" size="small" 
                            @click="(event: MouseEvent) => handleOptions(event, slotProps.node)"/>
                    </div> -->
                </template>
            </Tree>

            <Button label="Refresh" @click="handleRefresh" />
        </div>
    </div>
</template>
