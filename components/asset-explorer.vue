<script setup lang="ts">
import type { FileObject } from "@supabase/storage-js";
import type { TreeNode } from "primevue/treenode";
import { ref, onMounted } from "vue";
import type { SupaItem } from "~/core/data/models/supabase/supa-item";

const nodes = ref<TreeNode[] | undefined>(undefined);
const isLoading = ref(false);

const initiateNodes = async (): Promise<TreeNode[]> => {
    isLoading.value = true;
    const { data, error} = await useFetch<FileObject[]>("/api/folders");

    isLoading.value = false;

    if (error.value) {
        console.error("Error fetching folders:", error.value);
        return [];
    }

    if (data.value === null) {
        return [];
    }

    return data.value.map((item) => {
        return {
            key: item.name,
            label: item.name,
            leaf: false,
            loading: isLoading.value,
            icon: "pi pi-folder"
        };
    });
};

nodes.value = await initiateNodes();

const onNodeExpand = (node: TreeNode) => {
    if (!node.children) {
        node.loading = true;

        // Simulate time to load the child notes
        setTimeout(() => {
            let _node = { ...node };

            _node.children = [];

            for (let i = 0; i < 3; i++) {
                _node.children.push({
                    key: node.key + "-" + i,
                    label: "Lazy " + node.label + "-" + i
                });
            }

            if (nodes.value) {
                // Add the newly created node and it's children to the exiting list of parent nodes and set loading to false
                nodes.value[parseInt(node.key, 10)] = { ..._node, loading: false };
            }
        }, 500);
    }
};

</script>


<template>
    <div class="card flex flex-wrap gap-4">
        <div class="flex-auto md:flex md:justify-start md:items-center flex-col">
            <label class="font-bold block mb-2">Icon Mode</label>
            <Tree :value="nodes" @node-expand="onNodeExpand" loadingMode="icon" class="w-full md:w-[30rem]" />
        </div>
    </div>
</template>
