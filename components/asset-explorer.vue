<script setup lang="ts">
import { node } from "@primeuix/themes/aura/organizationchart";
import type { FileObject, FileObjectV2 } from "@supabase/storage-js";
import type { TreeNode } from "primevue/treenode";
import { ref, onMounted } from "vue";
import type { FolderItem } from "~/core/data/folder-item";
import type { SupaItem } from "~/core/data/models/supabase/supa-item";

// const nodes = ref<TreeNode[] | undefined>(undefined);
const isLoading = ref(false);

// Use useLazyFetch to fetch data on server side and hydrate on client

// if (import.meta.server) {
//     console.log("Server Side");
// } else {
//     console.log("Client Side");
// }


// const { data: folderData, pending: isLoading } = await useLazyFetch<FolderItem[]>("/api/folders", {
//     key: "folders-list",
//     server: true
// });
// const folders = await useFolders();

// Direct useLazyFetch call with unique key
const { data: folderData, pending } = await useLazyFetch<FolderItem[]>("/api/folders", {
    key: 'folders-direct-call',
    server: true,
    default: () => []
});

// Computed property to transform data into TreeNode format

let nodes = ref<TreeNode[]>([]);

nodes.value = folderData.value.map((item) => {
    return {
        key: item.name,
        label: item.name,
        leaf: !item.hasChildren,
        loading: isLoading.value,
        icon: "pi pi-folder"
    };
});

// const nodes = computed<TreeNode[]>(() => {
//     if (!folderData.value) return [];

//     return folderData.value.map((item) => {
//         return {
//             key: item.name,
//             label: item.name,
//             leaf: !item.hasChildren,
//             loading: isLoading.value,
//             icon: "pi pi-folder"
//         };
//     });
// });

// const initiateNodes = async (): Promise<TreeNode[]> => {
//     console.log("Initiating nodes...");
//     isLoading.value = true;
//     const { data, error} = await useFetch<FolderItem[]>("/api/folders");

//     isLoading.value = false;

//     if (error.value) {
//         console.error("Error fetching folders:", error.value);
//         return [];
//     }

//     if (data.value === null) {
//         return [];
//     }

//     return data.value.map((item) => {
//         return {
//             key: item.name,
//             label: item.name,
//             leaf: !item.hasChildren,
//             loading: isLoading.value,
//             icon: "pi pi-folder"
//         };
//     });
// };

const onNodeExpand = (node: TreeNode) => {
    if (!node.children) {
        node.loading = true;

        // Simulate time to load the child notes
        setTimeout(() => {
            node.loading = false;
            let _node = { ...node };

            _node.children = [];

            for (let i = 0; i < 3; i++) {
                _node.children.push({
                    key: node.key + "-" + i,
                    label: "Lazy " + node.label + "-" + i,
                    leaf: true
                });
            }

            // Find the node in the array by key and update it
            const nodeIndex = nodes.value.findIndex(n => n.key === node.key);
            if (nodeIndex !== -1) {
                nodes.value[nodeIndex] = { ..._node, loading: false };
            }
        }, 500);
    }
};

const handleClick = () => {
    console.log("bUTTON clicked");
    nodes.value.forEach(node => {
        console.log("Toggling node");
        node.loading = !node.loading;
    });
};

</script>


<template>
    <div class="card flex flex-wrap gap-4">
        <div class="flex-auto md:flex md:justify-start md:items-center flex-col">
            <label class="font-bold block mb-2">Icon Mode</label>
            <Tree :value="nodes" @node-expand="onNodeExpand" loadingMode="icon" class="w-full md:w-[30rem]" />

            <Button label="toggle" @click="handleClick" />
        </div>
    </div>
</template>
